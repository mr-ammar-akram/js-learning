
const pool = require('../models/db_learning'); 
const bcrypt = require("bcrypt");

class ConfigModel {

    static async  createConfig(userData){
        const client = await pool.connectDb();
        try{
            const hashedPass = await bcrypt.hash(userData.user_password, 10);
            let isVerified = false;
            if(userData.user_role === 'admin'){
                isVerified = true;
            }
            if(!userData.user_phone){
                userData.user_phone = '';
            }
            const query = `
                INSERT INTO users (user_email, user_name, full_name, user_role, user_phone, user_password, is_verified)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *;
            `;
            const values = [
                userData.user_mail,
                userData.user_name,
                userData.full_name,
                userData.user_role,
                userData.user_phone,
                hashedPass,
                isVerified
            ];
            const result = await client.query(query, values);
            return result.rows[0];
        }
        catch(error){   
            return error; 
        }
        finally {
            client.release();
        }
    }


    // admin exist in users table
    static async checkAdminExists() {

        const client = await pool.connectDb();
        try {
            const query = `
                SELECT * FROM users WHERE user_role = 'admin' LIMIT 1;
            `;
            const result = await client.query(query);
            if (result.rows.length === 0) {
                return {
                    message: 'Admin does not exist',
                    success: false,
                };
            } else {
                return {
                    user: result.rows[0],
                    message: 'Admin exist',
                    success: true,
                };
            }
        }
        catch (error) {
            return error;
        }
        finally {
            client.release();
        }
    }

}           
module.exports = ConfigModel;    