const pool = require('../models/db_learning');

class FollowModel {
    static async follow(followData){
        const client = await pool.connectDb();
        try{
            const existQuery = {
                text: `SELECT * FROM followers WHERE follower_id = $1 AND following_id = $2`,
                values: [followData.follower_id, followData.following_id]
            }
            const existResult = await client.query(existQuery);
            if(existResult.rows.length > 0){
                const deleteQuery = {
                    text: `DELETE FROM followers WHERE id = $1`,
                    values: [existResult.rows[0].id]
                }
                const deleteResult = await client.query(deleteQuery);
                if(deleteResult.rows.length === 0){
                    return {
                        success: true,
                        status: 'unfollow',
                        message: 'Follow deleted successfully',
                        data: deleteResult.rows[0]
                    }
                }
            }

            const query = {
                text: `INSERT INTO followers(follower_id, following_id, follow_status) VALUES($1, $2, $3) RETURNING *`,
                values: [followData.follower_id, followData.following_id, followData.follow_status]
            }
            const result = await client.query(query);
            if(result.rows.length === 0){
                return {
                    success: false,
                    message: 'Follow not added',
                    data: []
                }
            }
            const getAuthorQuery = {
                text: `SELECT * FROM users WHERE id = $1`,
                values: [followData.following_id]
            }
            const getAuthorResult = await client.query(getAuthorQuery);
            if(getAuthorResult.rows.length === 0){
                return {
                    success: false,
                    message: 'Author not found',
                    data: []
                }
            }
            result.rows[0].author = getAuthorResult.rows[0].user_email;
            result.rows[0].authorName = getAuthorResult.rows[0].full_name;
            const followerQuery = {
                text: `SELECT * FROM users WHERE id = $1`,
                values: [followData.follower_id]
            }
            const followerResult = await client.query(followerQuery);
            if(followerResult.rows.length === 0){
                return {
                    success: false,
                    message: 'Follower not found',
                    data: []
                }
            }
            result.rows[0].follower = followerResult.rows[0].full_name;

            const currentBlog = {
                text: `SELECT * FROM posts WHERE id = $1`,
                values: [followData.blog_id]
            }
            const currentBlogResult = await client.query(currentBlog);
            if(currentBlogResult.rows.length === 0){
                return {
                    success: false,
                    message: 'Blog not found',
                    data: []
                }
            }
            result.rows[0].blog = currentBlogResult.rows[0].title;
            return {
                success: true,
                status: 'follow',
                message: 'Follow added successfully',
                data: result.rows[0],
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

module.exports = FollowModel;
