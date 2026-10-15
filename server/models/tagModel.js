const pool = require('../models/db_learning');

class TagModel {
    static async addTag(tagData) {
        const client = await pool.connectDb();
        try {
            const query = `
                INSERT INTO post_tags (tag_name, tag_slug, description)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const values = [
                tagData.name,
                tagData.slug,
                tagData.description,
            ];
            const result = await client.query(query, values);
            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: 'Tag not added',
                    data: []
                };
            }
            return {
                success: true,
                message: 'Tag added successfully',
                data: result.rows[0]
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                data: []
            };
        }
        finally {
            client.release();
        }
    }

    static async getTags(){
        const client = await pool.connectDb();
        try {
            const query = `
                SELECT * FROM post_tags;
            `;
            const result = await client.query(query);
            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: 'No tags found',
                    data: []
                };
            }
            return {
                success: true,
                message: 'Tags fetched successfully',
                data: result.rows
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
                data: []
            };
        }
        finally {
            client.release();
        }
    }

    static async deleteTag(id){
        const client = await pool.connectDb();
        try{
            const query = `
                DELETE FROM post_tags WHERE id = $1;
            `;
            const values = [id];
            const result = await client.query(query, values);
            if(result.rows.length !== 0){
                return {
                    success: false,
                    message: 'Tag not deleted',
                    data: []
                };
            }
            const Q2 = `SELECT tag_id FROM posts WHERE ',' || tag_id || ',' LIKE '%,' || $1 || ',%'`;
            const V2 = [id];
            const result2 = await client.query(Q2, V2);
            const updatedTagId = result2.rows.map(row => row.tag_id.split(',').filter(num => num !== id).join(','));
            
            const Q3 = `UPDATE posts SET tag_id = $1 WHERE id = $2`;
            const V3 = [updatedTagId.join(','), id];    
            await client.query(Q3, V3);
            return {
                success: true,
                message: 'Tag deleted successfully',
                data: result.rows[0]
            };
        }
        catch(error){
            return {
                success: false,
                message: error.message,
                data: []
            };
        }
        finally{
            client.release();
        }
    }

    static async getTagById(id){
        const client = await pool.connectDb();
        try{
            const query = `
                SELECT * FROM post_tags WHERE id = $1;
            `;
            const values = [id];
            const result = await client.query(query, values);
            if(result.rows.length === 0){
                return {
                    success: false,
                    message: 'No tag found',
                    data: []
                };
            }
            return {
                success: true,
                message: 'Tag fetched successfully',
                data: result.rows[0]
            };
        }
        catch(error){
            return {
                success: false,
                message: error.message,
                data: []
            };
        }
        finally{
            client.release();
        }
    }

    static async updateTag(id, tagData){
        const client = await pool.connectDb();
        try{
            const query = `
                UPDATE post_tags SET tag_name = $1, tag_slug = $2, description = $3 WHERE id = $4 RETURNING *;
            `;
            const values = [
                tagData.tag_name,
                tagData.tag_slug,
                tagData.description,
                id
            ];
            const result = await client.query(query, values);
            if(result.rows.length === 0){
                return {
                    success: false,
                    message: 'Tag not updated',
                    data: []
                };
            }

            return {
                success: true,
                message: 'Tag updated successfully',
                data: result.rows[0]
            };
        }
        catch(error){
            return {
                success: false,
                message: error.message,
                data: []
            };
        }
        finally{
            client.release();
        }
    }
}

module.exports = TagModel;