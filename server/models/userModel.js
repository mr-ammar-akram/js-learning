
const pool = require('../models/db_learning'); 
const bcrypt = require("bcrypt");

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
                        user.profile_image = profileResult.rows[0].file_url;
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
}           
module.exports = UserModel;    