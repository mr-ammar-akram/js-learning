
const pool = require('../models/db_learning'); 
const bcrypt = require("bcrypt");

class UserModel {
    static async    createUserTable(){
        return await pool.createUserTable();
    }
    
    static async createUser(userEmail, userName, userPhone, userPassword){

        const client = await pool.connectDb();
        try{
            await this.createUserTable();

            const hashedPass = await bcrypt.hash(userPassword, 10);
            const query = `
                INSERT INTO users (userEmail, userName, userPhone, userPassword)
                VALUES ($1, $2, $3, $4)
                RETURNING *;
            `;
            console.log("user data",userEmail, userName, userPhone, hashedPass);
            console.log("Query:", query);
            
            const result = await client.query(query, [
                userEmail,
                userName,
                userPhone,
                hashedPass
            ]);
            console.log("Created User:", result.rows[0]);
            return result.rows[0];
        }
        finally {
            client.release();
        }
    }
}   
module.exports = UserModel;    