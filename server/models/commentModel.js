const pool = require('../models/db_learning');

class CommentModel {
    static async getAllComments(){
        const client = await pool.connectDb();
        try{
            const query = {
                text: `SELECT * FROM posts_comments`
            }
            const result = await client.query(query);
            if(result.rows.length === 0){
                return {
                    success: false,
                    message: 'Comments not found',
                    data: []
                }
            }
            for(let i = 0; i < result.rows.length; i++){
                const userQuery = {
                    text: `SELECT * FROM users WHERE id = $1`,
                    values: [result.rows[i].user_id]
                }
                const userResult = await client.query(userQuery);
                result.rows[i].commentor_name = userResult.rows[0].full_name;
                result.rows[i].commentor_email = userResult.rows[0].user_email;
                const postQuery = {
                    text: `SELECT * FROM posts WHERE id = $1`,
                    values: [result.rows[i].post_id]
                }
                const postResult = await client.query(postQuery);
                result.rows[i].post_title = postResult.rows[0].title;
            }
            return {
                success: true,
                message: 'Comments found successfully',
                data: result.rows
            }
        }catch(error){
            return {
                success: false,
                message: error.message,
                data: []
            }
        }finally{
            client.release();
        }
    }
    static async addComment(commentData){
        const client = await pool.connectDb();
        try{
            const query = {
                text: `INSERT INTO posts_comments(post_id, user_id, content) VALUES($1, $2, $3) RETURNING *`,
                values: [commentData.post_id, commentData.user_id, commentData.comment]
            }
            const result = await client.query(query);
            if(result.rows.length === 0){
                return {
                    success: false,
                    message: 'Comment not added',
                    data: []
                }
            }
            return {
                success: true,
                message: 'Comment added successfully',
                data: result.rows[0]
            }
        }catch(error){
            return {
                success: false,
                message: error.message,
                data: []
            }
        }finally{
            client.release();
        }
    }

    static async replyComment(replyData){
        const client = await pool.connectDb();
        try{
            const query = {
                text: `INSERT INTO posts_comments(post_id, user_id, content, parent_id) VALUES($1, $2, $3, $4) RETURNING *`,
                values: [replyData.post_id, replyData.user_id, replyData.comment, replyData.parent_id]
            }
            const result = await client.query(query);
            if(result.rows.length === 0){
                return {
                    success: false,
                    message: 'Reply not added',
                    data: []
                }
            }
            return {
                success: true,
                message: 'Reply added successfully',
                data: result.rows[0]
            }
        }catch(error){
            return {
                success: false,
                message: error.message,
                data: []
            }
        }finally{
            client.release();
        }
    }

    static async updateComment(updateData){
        const client = await pool.connectDb();
        try{
            const query = {
                text: `UPDATE posts_comments SET content = $1 WHERE id = $2 RETURNING *`,
                values: [updateData.comment, updateData.comment_id]
            }
            const result = await client.query(query);
            if(result.rows.length === 0){
                return {
                    success: false,
                    message: 'Comment not updated',
                    data: []
                }
            }
            return {
                success: true,
                message: 'Comment updated successfully',
                data: result.rows[0]
            }
        }catch(error){
            return {
                success: false,
                message: error.message,
                data: []
            }
        }finally{
            client.release();
        }
    }


    static async saveMessage(messageData){
        const client = await pool.connectDb();
        try{
            const query = {
                text: `INSERT INTO messages(sender_id, receiver_id, message_text) VALUES($1, $2, $3) RETURNING *`,
                values: [messageData.sender_id, messageData.receiver_id, messageData.message_text]
            }
            const result = await client.query(query);
            if(result.rows.length === 0){
                return {
                    success: false,
                    message: 'Message not saved',
                    data: []
                }
            }
            return {
                success: true,
                message: 'Message saved successfully',
                data: result.rows[0]
            }
        }catch(error){
            return {
                success: false,
                message: error.message,
                data: []
            }
        }finally{
            client.release();
        }
    }

    static async getChatsUsers(userId){
        const client = await pool.connectDb();
        try{
            // get chat users with message_count only unread message count
            const query = {
                // add author image url full with base url
                text: `
                        SELECT
                            u.id AS user_id,
                            u."full_name",
                            u."user_email",
                            COUNT(m.id) FILTER (WHERE m.is_read = false AND m.receiver_id = $1) AS unread_message_count,
                            MAX(m.created_at) AS last_message_time,
                            CONCAT('http://localhost:5000/', a.file_url) AS user_image_url,
                            (
                                SELECT m2.message_text
                                FROM messages m2
                                WHERE
                                    (
                                        m2.sender_id = $1
                                        AND m2.receiver_id = u.id
                                    )
                                    OR
                                    (
                                        m2.sender_id = u.id
                                        AND m2.receiver_id = $1
                                    )
                                ORDER BY m2.created_at DESC
                                LIMIT 1
                            ) AS last_message
                        FROM users u
                        LEFT JOIN attachments a
                            ON u.attachment_id = a.id

                        JOIN messages m
                            ON (
                                (m.sender_id = $1 AND m.receiver_id = u.id)
                                OR
                                (m.sender_id = u.id AND m.receiver_id = $1)
                            )

                        WHERE u.id != $1

                        GROUP BY
                            u.id,
                            u."full_name",
                            u."user_email",
                            a.file_url

                        ORDER BY last_message_time DESC
                    `,
                    values: [userId]
            }
                    
                    const result = await client.query(query);
                    
                    if(!result.rows){
                        return {
                            success: false,
                            message: 'No Chat History',
                            data: []
                        }
                    }
                    return {
                        success: true,
                        message: 'Chats found successfully',
                        data: result.rows
                    }
        }catch(error){
            return {
                success: false,
                message: error.message,
                data: []
            }
        }finally{
            client.release();
        }
    }
}
module.exports = CommentModel;
