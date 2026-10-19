
const pool = require('../models/db_learning'); 

class ProfileModel {
    //profile image upload
    static async profileImage(file, user_id){
        const client = await pool.connectDb();
        // req.file {
        //     fieldname: 'file',
        //     originalname: '746878371_122111570366688080_8430275928718884264_n.jpg',
        //     encoding: '7bit',
        //     mimetype: 'image/jpeg',
        //     path: 'uploads/1784284531000-110021035-746878371_122111570366688080_8430275928718884264_n.jpg',
        //     destination: 'uploads/',
        //     filename: '1784284531000-110021035-746878371_122111570366688080_8430275928718884264_n.jpg',
        //     size: 140376
        //     }
        try{
            const query = "INSERT INTO attachments (file_name, file_type, file_size, file_url) VALUES ($1, $2, $3, $4) RETURNING *"
            const value = [file.originalname, file.mimetype, file.size, file.path];
            const result = await client.query(query, value);
            if(result.rows.length !== 0){
                const updateQuery = "UPDATE users SET attachment_id = $1 WHERE id = $2 RETURNING *"
                const updateValue = [result.rows[0].id, user_id];
                const updateResult = await client.query(updateQuery, updateValue);
                if(updateResult.rows.length !== 0){
                    return {
                        success: true,
                        message: 'Image uploaded and id stored in users table successfully',
                        data: result.rows[0]
                    }
                }
                return {
                    success: true,
                    message: 'Image uploaded but id not stored in users table',
                    data: result.rows[0]
                }
            }
            return {
                success: false,
                message: 'Image not uploaded',
                data: []
            }
        }catch (err){
            return {
                success: false,
                message: err.message,
                data: []
            }
        }finally {
                client.release();
        }
    }

    static async getProfileImage(user_id){
        const client = await pool.connectDb();
        try{
            const query = "SELECT * FROM users WHERE id = $1"
            const value = [user_id];
            const result = await client.query(query, value);
            if(result.rows.length !== 0){
                const query2 = "SELECT file_url FROM attachments WHERE id = $1"
                const value2 = [result.rows[0].attachment_id];
                const result2 = await client.query(query2, value2);
                if(result2.rows.length !== 0){
                    result.rows[0].profile_image = "http://localhost:5000/" + result2.rows[0].file_url
                    return {
                        success: true,
                        message: 'Image found successfully',
                        data: result.rows[0]
                    }
                }
            }
            return {
                success: false,
                message: 'Image not found',
                data: []
            }
        }catch (err){
            return {
                success: false,
                message: err.message,
                data: []
            }
        }finally {
                client.release();
        }
    }

    static async addCategoryImage(file){
        const client = await pool.connectDb();
        try{
            const query = "INSERT INTO attachments (file_name, file_type, file_size, file_url) VALUES ($1, $2, $3, $4) RETURNING *"
            const value = [file.originalname, file.mimetype, file.size, file.path];
            const result = await client.query(query, value);
            if(result.rows.length !== 0){
                return {
                    success: true,
                    message: 'Image uploaded successfully',
                    data: result.rows[0].id
                }
            }
            return {
                success: false,
                message: 'Image not uploaded',
                data: []
            }
        }catch (err){
            return {
                success: false,
                message: err.message,
                data: []
            }
        }finally {
                client.release();
        }
    }
    
}
module.exports = ProfileModel;