
const pool = require('../models/db_learning'); 
const bcrypt = require("bcrypt");

class ConfigModel {
    static async createUserTable(){
        return await pool.createUserTable();
    }

    static async  createConfig(userData){
        const client = await pool.connectDb();
        try{
            await this.createUserTable();

            const hashedPass = await bcrypt.hash(userData.userPassword, 10);
            const query = `
                INSERT INTO users (user_email, user_name, user_role, user_password, is_verified)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;
            const result = await client.query(query, [
                userData.userEmail,
                userData.userName,
                userData.userRole,
                hashedPass,
                userData.is_verified
            ]);
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
            //first check table exist
            const tableCheckQuery = `SELECT EXISTS (
                        SELECT 1 
                        FROM information_schema.tables 
                        WHERE table_schema = 'public' 
                        AND table_name = 'users'
                    );
                    `
            const tableResult = await client.query(tableCheckQuery);

            if (!tableResult.rows[0].exists) {
                return {
                    message: 'Users table does not exist',
                    success: false,
                };
            }
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