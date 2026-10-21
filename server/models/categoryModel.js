const pool = require('./db_learning');
const baseUrl = process.env.BASE_URL;

class CategoryModel {
    static async addCategory(categoryData, catImageId) {
        const client = await pool.connectDb();
        try {
            const query = `
                INSERT INTO post_categories (cat_name, cat_slug, description, attachment_id)
                VALUES ($1, $2, $3, $4)
                RETURNING *;
            `;
            const values = [
                categoryData.cat_name,
                categoryData.cat_slug,
                categoryData.description,
                catImageId
            ];
            const result = await client.query(query, values);
            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: 'Category not added',
                    data: []
                }
            }
            return {
                success: true,
                message: 'Category added successfully',
                data: result.rows[0]
            }
        }
        catch (error) {
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

    static async getCategories() {
        const client = await pool.connectDb();
        try {
            const query = `
                SELECT * FROM post_categories;
            `;
            const result = await client.query(query);
            const attachmentQuery = `SELECT file_url FROM attachments WHERE id = $1;`
            // const values = result.rows.map((row) => row.attachment_id);
            for (const row of result.rows) {
                if (row.attachment_id) {
                    const result2 = await client.query(attachmentQuery, [row.attachment_id]);
                    // Check if attachment exists to prevent errors
                    row.cat_image_url = baseUrl + result2.rows[0]?.file_url || null;
                } else {
                    row.cat_image_url = null;
                }
            }

            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: 'No categories found',
                    data: []
                }
            }
            return {
                success: true,
                message: 'Categories fetched successfully',
                data: result.rows
            }
        } catch (error) {
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

    static async deleteCategory (id){
        const client = await pool.connectDb();
        try {
            const query = `
                DELETE FROM post_categories WHERE id = $1;
            `;
            const values = [id];
            const result = await client.query(query, values);

            if (result.rows.length !== 0) {
                return {
                    success: false,
                    message: 'Category not deleted',
                    data: []
                }
            }

            const Q2 = `SELECT cat_id FROM posts WHERE ',' || cat_id || ',' LIKE '%,' || $1 || ',%'`;
            const V2 = [id];
            const result2 = await client.query(Q2, V2);
            updatedCats =   result2.rows.split(',').filter(num => num !== id).join(',');

            const Q3 = `UPDATE posts SET cat_id = $1 WHERE id = $2`;
            const V3 = [updatedCats.join(','), id];
            await client.query(Q3, V3);

            return {
                success: true,
                message: 'Category deleted successfully',
                data: result.rows[0]
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: []
            }
        } finally {
            client.release();
        }
    }
    
    static async getCategoryById(catID){
         const client = await pool.connectDb();
         try {
            const query = `
                SELECT * FROM post_categories WHERE id = $1;
            `;
            const values = [catID];
            const result = await client.query(query, values);
            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: 'No category found',
                    data: []
                }
            }

            if(result.rows[0].attachment_id){
                const Q2 = "SELECT * FROM attachments WHERE id = $1";
                const V2 = [result.rows[0].attachment_id];
                const result2 = await client.query(Q2, V2);
                result.rows[0].cat_image_url = baseUrl + result2.rows[0].file_url;
            }
            else{
                result.rows[0].cat_image_url = null;
            }
            return {
                success: true,
                message: 'Category fetched successfully',
                data: result.rows[0]
            }
         } catch (error) {
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

    static async updateCategory(id, categoryData, attachmentId){
        const client = await pool.connectDb();
        try {
            let query = `
                UPDATE post_categories SET cat_name = $1, cat_slug = $2, description = $3, attachment_id = $4 WHERE id = $5 RETURNING *;
            `;
            let values = [categoryData.cat_name, categoryData.cat_slug, categoryData.description, "", id];
            if (attachmentId !== null) {
                values = [categoryData.cat_name, categoryData.cat_slug, categoryData.description, attachmentId, id];
            }
            const result = await client.query(query, values);
            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: 'No category found',
                    data: []
                }
            }
            return {
                success: true,
                message: 'Category updated successfully',
                data: result.rows[0]
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: []
            }
        } finally {
            client.release();
        }
    }
}

module.exports = CategoryModel;
