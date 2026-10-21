
const pool = require('../models/db_learning'); 
const bcrypt = require("bcrypt");
const baseUrl = process.env.BASE_URL;

class UserModel {
    
    static async createUser(userData){
        const client = await pool.connectDb();
        try{
            const hashedPass = await bcrypt.hash(userData.userPassword, 10);
            const query = `
                INSERT INTO users (user_email, full_name, user_name, user_phone, user_password)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;
            const result = await client.query(query, [
                userData.userEmail,
                userData.userFullName,
                userData.userName,
                userData.userPhone,
                hashedPass
            ]);
            //remove password field from response
            delete result.rows[0].user_password;
            return {
                success: true,
                message: 'User created successfully',
                data: result.rows[0]
            }
        }
        catch(error){
            return {
                success: false,
                message: error.message,
                data: []
            }
        }
        finally {
            client.release();
        }
    }

    static async authenticateUser(userData){
        const client = await pool.connectDb();

        try{
            const query = `
                SELECT * FROM users WHERE user_email = $1 OR user_phone = $1;
            `;
            const result = await client.query(query, [userData.user_email]);
            if(result.rows.length === 0){
                return {
                    message: 'User not Found',
                    success: false,
                };
            }else{
                const validPassword = await bcrypt.compare(userData.user_password, result.rows[0].user_password);
                if(!validPassword){
                    return {
                        message: 'Invalid Password',
                        success: false,
                    };
                }else{
                    if(result.rows[0].is_verified === false){
                        delete result.rows[0].user_password;
                        return {
                            message: 'User not verified',
                            status: 'not_verified',
                            success: false,
                            user: result.rows[0]
                        };
                    }
                    //return user without password
                    delete result.rows[0].user_password;
                    return {
                        user: result.rows[0],
                        success: true,
                    };
                }
            }
        }
        catch(error){
            return error;
        }
        finally {
            client.release();
        }
    }

    static async updateStatus(user_id, status){
        const client = await pool.connectDb();
        try{
            const query = `UPDATE users SET is_verified = $1 WHERE id = $2 RETURNING *`;
            const values = [status, user_id];
            const result = await client.query(query, values);
            if(result.rows.length === 0){
                return {
                    success: false,
                    message: 'User not found',
                    data: []
                }
            }   
            //return user without password
            delete result.rows[0].user_password;    
            return {
                success: true,
                message: 'Status updated successfully',
                data: result.rows[0]
            }
        }catch (err){
            return err; 
        }finally {
                client.release();
        }
    }

  static async getUserByID(userID){
        const client = await pool.connectDb();
            try{
                const query = `SELECT * FROM users WHERE id = $1`;
                const values = [userID];
                const result = await client.query(query, values);
                // 3. Handle the "User Not Found" scenario
                if (result.rows.length !== 0) {
                    const profileQuery = `SELECT * FROM attachments WHERE id = $1`;
                    const profileValue = [result.rows[0].attachment_id];
                    const profileResult = await client.query(profileQuery, profileValue);
                    const user = result.rows[0];
                    if(profileResult.rows.length !== 0){
                        user.profile_image = baseUrl + profileResult.rows[0].file_url;
                    }
                    delete user.user_password;
                    return { 
                        success: true, 
                        message: 'User found',
                        data: user 
                    };

                }else{
                    return { 
                        success: false, 
                        message: 'User not found',
                    };
                }
        }catch (err){
            return err;
        }finally {
                client.release();
        }
    }

    static async getUserByEmail(user_mail){
        const client = await pool.connectDb();
        try{
            const query = `SELECT * FROM users WHERE user_email = $1`;
            const values = [user_mail];
            const result = await client.query(query, values);
            if(result.rows.length !== 0){
                const user = result.rows[0];
                return { 
                    success: true, 
                    message: 'User found',
                    data: user 
                };
            }else{
                return { 
                    success: false, 
                    message: 'User not found',
                };
            }
        }catch(err){
            return err;
        }finally{
            client.release();
        }
    }

    static async getAllUsers() {
        const client = await pool.connectDb();
        try {
            const query = `SELECT * FROM users`;
            const result = await client.query(query);
            if (result.rows.length !== 0) {
                const users = result.rows;
                return { 
                    success: true, 
                    message: 'Users found',
                    data: users 
                };
            } else {
                return { 
                    success: false, 
                    message: 'Users not found',
                    data: [] 
                }; 
            }
        } catch (err) {
            return err;
        } finally {
            client.release();
        }
    }
    static async getNonAdminUsers() {
        const client = await pool.connectDb();
        try {
            const query = `SELECT * FROM users WHERE user_role != 'admin'`;
            const result = await client.query(query);
            if (result.rows.length !== 0) {
                const users = result.rows;
                for(const user of users){
                    const profileQuery = `SELECT * FROM attachments WHERE id = $1`;
                    const profileValue = [user.attachment_id];
                    const profileResult = await client.query(profileQuery, profileValue);
                    if(profileResult.rows.length !== 0){
                        user.user_image_url = baseUrl + profileResult.rows[0].file_url;
                    }
                    delete user.user_password;
                    delete user.user_role;
                    delete user.is_verified;
                    delete user.created_at;
                    delete user.updated_at;
                }
                return { 
                    success: true, 
                    message: 'Users found',
                    data: users 
                };
            } else {
                return { 
                    success: false, 
                    message: 'Users not found',
                    data: [] 
                };
            }
        } catch (err) {
            return err;
        } finally {
            client.release();
        }
    }

    static async deleteUserByID(id) {
        const client = await pool.connectDb();
        try {
            const query = `DELETE FROM users WHERE id = $1`;
            const values = [id];
            const result = await client.query(query, values);
            if (result.rows.length === 0) {
                return { 
                    success: true, 
                    message: 'User deleted successfully',
                    data: [] 
                };
            } else {
                return { 
                    success: false, 
                    message: 'Users not found',
                    data: [] 
                };
            }
        } catch (err) {
            return err;
        } finally {
            client.release();
        }
    }

    static async updateUserByID(id, userData){
        const client = await pool.connectDb();
        try{
            const query = `UPDATE users SET full_name = $1, user_email = $2, user_name = $3, user_phone = $4, user_role = $5, is_verified = $6, user_bio = $7  WHERE id = $8 RETURNING *`;
            const values = [userData.full_name, userData.user_email, userData.user_name, userData.user_phone, userData.user_role, userData.is_verified, userData.user_bio, id];
            const result = await client.query(query, values);
            if(result.rows.length !== 0){
                return { 
                    success: true, 
                    message: 'User updated successfully',
                    data: result.rows[0]
                };  
            }else{
                return { 
                    success: false, 
                    message: 'Users not found',
                    data: [] 
                };  
            }   
        }catch(err){
            return err;  
        }finally{
            client.release();
        }   
    }   

    static async getAuthorByID(author_id){
        const client = await pool.connectDb();
        try{
            const query = `SELECT * FROM users WHERE id = $1`;
            const values = [author_id];
            const result = await client.query(query, values);
            if(result.rows.length !== 0){
                const user = result.rows[0];
                //get profile image
                const profileQuery = `SELECT * FROM attachments WHERE id = $1`;
                const profileValue = [user.attachment_id];
                const profileResult = await client.query(profileQuery, profileValue);
                if(profileResult.rows.length !== 0){
                    user.profile_image = baseUrl + profileResult.rows[0].file_url;
                }
                delete user.user_password;
                //get follower count
                const followerQuery = `SELECT COUNT(*) FROM followers WHERE following_id = $1`;
                const followerValue = [author_id];
                const followerResult = await client.query(followerQuery, followerValue);
                user.follower_count = followerResult.rows[0].count;
                //get following count
                const followingQuery = `SELECT COUNT(*) FROM followers WHERE follower_id = $1`;
                const followingValue = [author_id];
                const followingResult = await client.query(followingQuery, followingValue);
                user.following_count = followingResult.rows[0].count;
                //get is_author count
                const isAuthorQuery = `SELECT COUNT(*) FROM posts WHERE author_id = $1`;
                const isAuthorValue = [author_id];
                const isAuthorResult = await client.query(isAuthorQuery, isAuthorValue);
                user.is_author = isAuthorResult.rows[0].count;
                
                // Get author all Posts
                const postsQuery = `SELECT * FROM posts WHERE author_id = $1`;
                const postsValue = [author_id];
                const postsResult = await client.query(postsQuery, postsValue);
                if(postsResult.rows.length !== 0){
                    for (let i = 0; i < postsResult.rows.length; i++) {
                        const postAttachmentQuery = `SELECT * FROM attachments WHERE id = $1`;
                        const postAttachmentValue = [postsResult.rows[i].attachment_id];
                        const postAttachmentResult = await client.query(postAttachmentQuery, postAttachmentValue);
                        if(postAttachmentResult.rows.length !== 0){
                            postsResult.rows[i].post_image_url = baseUrl + postAttachmentResult.rows[0].file_url;
                        }
                        const AuthorNameQuery = `SELECT * FROM users WHERE id = $1`;
                        const AuthorNameValue = [postsResult.rows[i].author_id];
                        const AuthorNameResult = await client.query(AuthorNameQuery, AuthorNameValue);
                        if(AuthorNameResult.rows.length !== 0){
                            postsResult.rows[i].author_name = AuthorNameResult.rows[0].user_name;
                        }
                        // Get author profile
                        const authorProfileQuery = `SELECT * FROM attachments WHERE id = $1`;
                        const authorProfileValue = [AuthorNameResult.rows[0].attachment_id];
                        const authorProfileResult = await client.query(authorProfileQuery, authorProfileValue);
                        if(authorProfileResult.rows.length !== 0){
                            postsResult.rows[i].author_profile = baseUrl + authorProfileResult.rows[0].file_url;
                        }
                        //get author all Posts Like and dislike Count
                        const postsLikeCountQuery = `SELECT COUNT(*) FROM post_likes WHERE post_id = $1 and post_like = 1`;
                        const postsLikeCountValue = [postsResult.rows[i].id];
                        const postsLikeCountResult = await client.query(postsLikeCountQuery, postsLikeCountValue);
                        postsResult.rows[i].posts_like_count = postsLikeCountResult.rows[0].count;

                        const postsDislikeCountQuery = `SELECT COUNT(*) FROM post_likes WHERE post_id = $1 and post_like = -1`;
                        const postsDislikeCountValue = [postsResult.rows[i].id];
                        const postsDislikeCountResult = await client.query(postsDislikeCountQuery, postsDislikeCountValue);
                        postsResult.rows[i].posts_dislike_count = postsDislikeCountResult.rows[0].count;

                        // post Categories
                        postsResult.rows[i].categories = await Promise.all(
                            postsResult.rows[i].cat_id.split(',').map(async (catId) => {
                                const categoryResult = await client.query(
                                    `SELECT * FROM post_categories WHERE id = $1`,
                                    [catId]
                                );
                                return categoryResult.rows[0];
                            })
                        );
                        postsResult.rows[i].tags = await Promise.all(
                            postsResult.rows[i].tag_id.split(',').map(async (tagId) => {
                                const tagResult = await client.query(
                                    `SELECT * FROM post_tags WHERE id = $1`,
                                    [tagId]
                                );
                                return tagResult.rows[0];
                            })
                        );
                        delete postsResult.rows[i].category_id;
                        delete postsResult.rows[i].tag_id;
                        
                    }
                }
                user.posts = postsResult.rows;

                return { 
                    success: true, 
                    message: 'User found',
                    data: user 
                };
            }else{
                return { 
                    success: false, 
                    message: 'User not found',
                };
            }
        }catch(err){
            return err;
        }finally{
            client.release();
        }
    }           
}
module.exports = UserModel;    