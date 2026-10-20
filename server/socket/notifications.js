const { pool } = require("../models/db_learning");

const createNotification = async (
    io,
    userId,
    message,
    postId = null
) => {

    try {

        // Save notification
        const result = await pool.query(
            `
            INSERT INTO notifications
            (
                user_id,
                message,
                post_id
            )
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [
                userId,
                message,
                postId
            ]
        );

        const notification = result.rows[0];

        // Send real-time notification
        io.to(`user_${userId}`).emit(
            "new_notification",
            notification
        );

        return notification;

    } catch (error) {

        console.error(
            "Notification error:",
            error
        );

        throw error;
    }
};

module.exports = createNotification;