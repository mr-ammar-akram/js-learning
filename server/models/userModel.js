
const pool = require('../models/db_learning'); 
const bcrypt = require("bcrypt");

class UserModel {
    static async createUserTable(){
        return await pool.createUserTable();
    }
    
    static async createUser(userData){
        const client = await pool.connectDb();
        try{
            await this.createUserTable();
            const hashedPass = await bcrypt.hash(userData.userPassword, 10);
            const query = `
                INSERT INTO users (user_email, user_name, user_phone, user_password)
                VALUES ($1, $2, $3, $4)
                RETURNING *;
            `;
            const result = await client.query(query, [
                userData.userEmail,
                userData.userName,
                userData.userPhone,
                hashedPass
            ]);
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

    static async getUserByID(userID){
        const client = await pool.connectDb();
            try{
                const query = `SELECT * FROM users WHERE id = $1`;
                const values = [userID];
                const result = await client.query(query, values);
                // 3. Handle the "User Not Found" scenario
                if (result.rows.length !== 0) {
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
}           
module.exports = UserModel;    