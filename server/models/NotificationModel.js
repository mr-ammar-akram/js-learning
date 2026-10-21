const { pool } = require("./db_learning");

class NotificationModel {

    // Create notification
    static async create(data) {
        console.log(data);
        const query = `
            INSERT INTO notifications
            (
                user_id,
                sender_id,
                type,
                message,
                post_id
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        const values = [
            data.receiver_id,
            data.sender_id || null,
            data.type,
            data.message_text,
            data.post_id || null
        ];
        const result = await pool.query(
            query,
            values
        );

        return result.rows[0];
    }

    // Get notifications for user only unread
    static async getByUserId(userId) {
        // add user image url with base uurl
        const baseUrl = process.env.BASE_URL;
        const query = `
            SELECT
                n.*,
                u.id AS sender_user_id,
                u.full_name AS sender_user_name,
                concat('${baseUrl}', a.file_url) AS user_image_url,
                m.is_read AS msg_is_read

            FROM notifications n

            LEFT JOIN users u
                ON u.id = n.sender_id
            LEFT JOIN attachments a 
                ON a.id = u.attachment_id
            LEFT JOIN messages m
                ON m.id = n.id
            WHERE n.user_id = $1
            
            ORDER BY n.created_at DESC

            LIMIT 50
        `;

        const result = await pool.query(
            query,
            [userId]
        );

        return result.rows;
    }


    // Mark one notification as read
    static async markAsRead(
        notificationId,
        userId
    ) {

        const query = `
            UPDATE notifications

            SET is_read = true

            WHERE id = $1
            AND user_id = $2

            RETURNING *
        `;

        const result = await pool.query(
            query,
            [
                notificationId,
                userId
            ]
        );

        return result.rows[0];
    }


    // Mark all notifications as read
    static async markAllAsRead(userId) {
        const query = `
            UPDATE notifications

            SET is_read = true

            WHERE user_id = $1
            AND is_read = false

            RETURNING *
        `;

        const result = await pool.query(
            query,
            [userId]
        );

        return result.rows;
    }


    // Mark all messages as read
    static async markAllMessagesAsRead(userId) {
        const query = `
            UPDATE messages 

            SET is_read = true

            WHERE receiver_id = $1
            AND is_read = false

            RETURNING *
        `;

        const result = await pool.query(
            query,
            [userId]
        );

        return result.rows;
    }

}


module.exports = NotificationModel;