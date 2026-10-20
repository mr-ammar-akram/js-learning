const jwt =
    require("jsonwebtoken");

const pool = require('../models/db_learning'); 

const CommentModel = require("../models/commentModel");

const NotificationModel = require("../models/NotificationModel");
const GroupChatModel = require("../models/groupChatModel");


 
const initSocket = (io) => {


    // =========================================
    // AUTHENTICATE SOCKET
    // =========================================

    io.use((socket, next) => {

        try {

            console.log(
                "🔐 Socket authentication..."
            );


            const token =
                socket.handshake.auth?.token;


            if (!token) {

                console.log(
                    "❌ Socket token missing"
                );

                return next(
                    new Error(
                        "No token provided"
                    )
                );

            }


            const cleanToken =
                token.replace(
                    "Bearer ",
                    ""
                );


            const decoded =
                jwt.verify(
                    cleanToken,
                    process.env.JWT_SECRET
                );


            console.log(
                "✅ Socket JWT:",
                decoded
            );


            // Attach user to socket
            socket.user =
                decoded;


            next();


        } catch (error) {

            console.error(
                "❌ Socket authentication failed:",
                error.message
            );


            next(
                new Error(
                    "Invalid token"
                )
            );

        }

    });


    // =========================================
    // CONNECTION
    // =========================================

    io.on(
        "connection",
        (socket) => {


            console.log(
                "🔥 Socket connected:",
                socket.id
            );


            console.log(
                "👤 Socket user:",
                socket.user
            );


            // Safety check
            if (
                !socket.user ||
                !socket.user.id
            ) {

                console.log(
                    "❌ Socket user ID missing"
                );

                socket.disconnect();

                return;

            }


            const userId =
                socket.user.id;


// Join a group room
socket.on("join_group_room", async ({ groupId }) => {
    try {
        const userId = socket.user?.id;
        const client = await pool.connectDb();


        if (!userId || !Number.isInteger(Number(groupId))) {
            socket.emit("group_chat_error", {
                message: "Invalid user or group ID",
            });
            return;
        }

        // Only active group members can join
        // I get pool is not defined error here please define pool 
          const query = `
            SELECT 1
            FROM chat_group_members
            WHERE group_id = $1
            AND user_id = $2
            AND member_status = 'active'
            LIMIT 1
        `;
        const queryResult = await client.query(query, [groupId, userId]);


        if (queryResult.rowCount === 0) {
            socket.emit("group_chat_error", {
                message: "You are not an active member of this group",
            });
            return;
        }

        const room = `group_${groupId}`;

        socket.join(room);

        socket.emit("group_room_joined", {
            groupId: Number(groupId),
            room,
        });

        console.log(`User ${userId} joined ${room}`);
    } catch (error) {
        console.error("Join group room error:", error);

        socket.emit("group_chat_error", {
            message: "Could not join group chat",
        });
    }
});


// Send a message to a group
socket.on("send_group_message", async ({ groupId, messageText }) => {
    try {
        const userId = socket.user?.id;
        const client = await pool.connectDb();
        const text = String(messageText || "").trim();
        const room = `group_${groupId}`;

        if (
            !userId ||
            !Number.isInteger(Number(groupId)) ||
            !text ||
            text.length > 5000
        ) {
            socket.emit("group_chat_error", {
                message: "Invalid group message",
            });
            return;
        }

        // Verify membership before saving or broadcasting
        const membership = await client.query(
            `SELECT 1
             FROM chat_group_members
             WHERE group_id = $1
               AND user_id = $2
               AND member_status = 'active'
             LIMIT 1`,
            [groupId, userId]
        );

        if (membership.rowCount === 0) {
            socket.emit("group_chat_error", {
                message: "You are not an active member of this group",
            });
            return;
        }

        // Save the message in PostgreSQL
        const result = await client.query(
            `INSERT INTO group_messages
                (group_id, user_id, message_text)
             VALUES ($1, $2, $3)
             RETURNING id, group_id, user_id, message_text, created_at`,
            [groupId, userId, text]
        );

        const message = result.rows[0];

        // Include sender name for the chat UI
        const userResult = await client.query(
            `SELECT "userName"
             FROM users
             WHERE id = $1`,
            [userId]
        );

        message.userName = userResult.rows[0]?.userName ?? "User";

        // Send to everyone currently in this group room
        io.to(room).emit("receive_group_message", message);
    } catch (error) {
        console.error("Send group message error:", error);

        socket.emit("group_chat_error", {
            message: "Could not send group message",
        });
    }
});

            
            

            // =====================================
            // PERSONAL NOTIFICATION ROOM
            // =====================================

            const notificationRoom =
                `user_${userId}`;


            socket.join(
                notificationRoom
            );


            console.log(
                `🔔 User ${userId} joined ${notificationRoom}`
            );
 

            // =====================================
            // Join Room
            // =====================================

            socket.on('join_room', ({ senderId, receiverId }) => {
                const roomId = [senderId, receiverId].sort().join('_');
                socket.join(roomId);
                console.log(`User joined room: ${roomId}`);
            });
            // Send message
            socket.on('send_message', async (messageData) => {
                const roomId = [messageData.sender_id, messageData.receiver_id].sort().join('_');
                const sender_id = messageData.sender_id;
                const receiver_id = messageData.receiver_id;
                const message_text = messageData.message_text;
                
                // Save to database (you'll need to implement this)
                await CommentModel.saveMessage(messageData);
                
                // Emit to specific room
                io.to(roomId).emit('receive_message', { 
                sender_id, 
                receiver_id, 
                message_text, 
                timestamp: new Date().toISOString()  
                });

                // =============================
                // CREATE NOTIFICATION
                // =============================
                await NotificationModel.create({
                    sender_id,
                    receiver_id,
                    message_text,
                    type: 'new_message',
                    post_id: null,
                });
                
                // Send notification to receiver if online
                io.to(`user_${receiver_id}`).emit('notification', {
                type: 'new_message',
                sender_id,
                message_text,
                timestamp: new Date().toISOString()
                });
            });


            // =====================================
            // Chat USERs
            // =====================================


            socket.on("get_chat_users", async () => {
                try {
                    const userId = socket.user.id;

                    const chatResults = await CommentModel.getChatsUsers(userId);
                    const groupchatResults = await GroupChatModel.getUserGroups(userId);

                    socket.emit(
                        "chat_users",
                        chatResults,
                        groupchatResults  
                    );

                } catch (error) {
                    console.error(
                        "Get chat users error:",
                        error
                    );
                }
            });


            // ======================== 
            // GROUP CHAT 
            // ========================
            socket.on("create_chat_group", async (data) => {
            try {
                const userId = socket.user.id;

                const { group_name, memberIds = [] } = data;

                if (!group_name?.trim()) {
                    socket.emit("chat_group_error", {
                        message: "Group name is required",
                    });
                    return;
                }

                // Always include the logged-in creator
                const uniqueMemberIds = [
                    ...new Set([
                        Number(userId),
                        ...memberIds.map(Number),
                    ]),
                ];

                // Create the group and add its members
                const group = await GroupChatModel.createGroup(
                    group_name.trim(),
                    userId,
                    uniqueMemberIds
                );

                // Notify the creator that the group was created
                socket.emit("chat_group_created", group);

                // Refresh the creator's chat and group lists
                const chatResults = await CommentModel.getChatsUsers(userId);
                const groupchatResults =
                    await GroupChatModel.getUserGroups(userId);

                socket.emit("chat_users", chatResults, groupchatResults);

            } catch (error) {
                console.error("Create chat group error:", error);

                socket.emit("chat_group_error", {
                    message: "Failed to create group",
                });
            }
        });

            // ==============================
            // === GROUPS CHAT ===
            // ==============================

            socket.on("create_chat_group", async (chatGroup) => {
                try {
                    // createGroup(group_name, creatorId, memberIds = [])
                    const {group_name, memberIds} = chatGroup;
                    const creatorId = socket.user.id;
                    const group = await GroupChatModel.createGroup(group_name, creatorId, memberIds);
                    console.log(
                        "Group created:",
                        group
                    ); 

                } catch (error) {
                    console.error(
                        "Create chat group error:",
                        error
                    );
                }
            });



    // --- EVENT: join_group_room ---
    socket.on('join_group_room', async ({ groupId }, callback) => {
      try {
        // Critical: Verify group membership first!
        const hasAccess = await GroupChatModel.isMember(groupId, userId);
        
        if (!hasAccess) {
          if (callback) callback({ status: 'error', message: 'Unauthorized access to this group chat.' });
          return;
        }

        const roomName = `group_${groupId}`;
        socket.join(roomName);
        console.log(`🚪 User ${userId} successfully joined room: ${roomName}`);

        if (callback) callback({ status: 'ok', message: `Joined room ${roomName}` });
      } catch (error) {
        console.error('Error joining group room:', error);
        if (callback) callback({ status: 'error', message: 'Internal server error.' });
      }
    });

    

            // =====================================
            // DISCONNECT
            // =====================================

            socket.on(
                "disconnect",
                () => {

                    console.log(
                        `❌ User ${userId} disconnected`
                    );

                }
            );

        }
    );

};


module.exports =
    initSocket;