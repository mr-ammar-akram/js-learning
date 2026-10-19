const pool = require('../models/db_learning');

class LikeModel {

    static async addLike(data) {

        const client = await pool.connectDb();

        try {

            // Check whether THIS USER already has a reaction
            const existQuery = `
                SELECT *
                FROM post_likes
                WHERE post_id = $1 OR comment_id = $2
                AND user_id = $3
            `;

            const existValues = [
                data.post_id,
                data.comment_id,
                data.user_id
            ];

            const existResult = await client.query(
                existQuery,
                existValues
            );

            // No reaction yet → INSERT
            if (existResult.rows.length === 0) {

                const query = `
                    INSERT INTO post_likes
                    (user_id, post_id, post_like, like_type, comment_id)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING *
                `;

                const values = [
                    data.user_id,
                    data.post_id,
                    data.like_status,
                    data.like_type,
                    data.comment_id
                ];

                const result = await client.query(query, values);

                if (result.rows.length === 0) {
                    return {
                        success: false,
                        message: "Like not added",
                        data: []
                    };
                }

                return {
                    success: true,
                    message: "Reaction added successfully",
                    data: result.rows[0]
                };
            }

            // User already has a reaction → DELETE
            const query = `
                DELETE FROM post_likes
                WHERE id = $1   
                RETURNING *
            `;

            const values = [
                existResult.rows[0].id
            ];

            const result = await client.query(query, values);

            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: "Reaction not removed",
                    data: []
                };
            }

            return {
                success: true,
                message: "Reaction removed successfully",
                data: result.rows[0]
            };

        } catch (error) {

            return {
                success: false,
                message: "Reaction not added",
                data: error.message
            };

        } finally {

            client.release();

        }
    }
}

module.exports = LikeModel;