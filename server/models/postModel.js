const { json } = require('express');
const pool = require('../models/db_learning');
const UserModel = require('./userModel');

class PostModel {
    static async addPostData(postData, postImageId) {
        const client = await pool.connectDb();
        try{
            const catString = JSON.stringify(postData.cat_id);
            const tagString = JSON.stringify(postData.tag_id);
            //remove "" from string
            const cleanCatString = catString.replace(/"/g, '');
            const cleanTagString = tagString.replace(/"/g, '');

            const query = {
                text: `INSERT INTO posts(title, slug, description, cat_id, tag_id, author_id, attachment_id)
                VALUES($1, $2, $3, $4, $5, $6, $7)
                RETURNING *`,
                values: [postData.title, postData.slug, postData.content, cleanCatString, cleanTagString, postData.author_id, postImageId]
            }
            const result = await client.query(query);
            if(result.rows.length === 0){
                return {
                    success: false,
                    message: 'Post not added',
                    data: []
                }
            }
            return {
                success: true,
                message: 'Post added successfully',
                data: result.rows[0]
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

    static async getPosts(){
        const client = await pool.connectDb();
        try{
            const query = {
                text: `SELECT * FROM posts`
            }
            const result = await client.query(query);
            if(result.rows.length === 0){
                return {
                    success: false,
                    message: 'Post not found',
                    data: []
                }
            }
            
            return {
                success: true,
                message: 'Post found successfully',
                data: result.rows
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

    static async deletePost(postId){
        const client = await pool.connectDb();
        try{
            const query = {
                text: `DELETE FROM posts WHERE id = $1`,
                values: [postId]
            }
            const result = await client.query(query);
            if(result.rows.length !== 0){
                return {
                    success: false,
                    message: 'Post not deleted',
                    data: []
                }
            }
            return {
                success: true,
                message: 'Post deleted successfully',
                data: result.rows[0]
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

    static async getPost(postId){
        const client = await pool.connectDb();
        try{
            const query = {
                text: `SELECT * FROM posts WHERE id = $1`,
                values: [postId]
            }
            const result = await client.query(query);
            if(result.rows.length === 0){
                return {
                    success: false,
                    message: 'Post not found',
                    data: []
                }
            }
            const imageQuery = {
                text: `SELECT * FROM attachments WHERE id = $1`,
                values: [result.rows[0].attachment_id]
            }
            const imageResult = await client.query(imageQuery);
            if(imageResult.rows.length === 0){
                return {
                    success: false,
                    message: 'Image not found',
                    data: []
                }
            }
            result.rows[0].post_image_url = "http://localhost:5000/" + imageResult.rows[0].file_url;
            result.rows[0].cat_id = result.rows[0].cat_id.split(',').map(Number);
            result.rows[0].tag_id = result.rows[0].tag_id.split(',').map(Number);
            
            return {
                success: true,
                message: 'Post found successfully',
                data: result.rows[0]
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
    
    static async updatePost(postId, postData, attachmentId){
        const client = await pool.connectDb();
            const catString = JSON.stringify(postData.cat_id);
            const tagString = JSON.stringify(postData.tag_id);
            //remove "" from string
            const cleanCatString = catString.replace(/"/g, '');
            const cleanTagString = tagString.replace(/"/g, '');
        try{
            const query = {
                text: `UPDATE posts SET title = $1, slug = $2, description = $3, cat_id = $4, tag_id = $5, author_id = $6, attachment_id = $7 WHERE id = $8 RETURNING *`,
                values: [postData.title, postData.slug, postData.description, cleanCatString, cleanTagString, postData.author_id, attachmentId, postId]
            }
            const result = await client.query(query);
            if(result.rows.length === 0){
                return {
                    success: false,
                    message: 'Post not updated',
                    data: []
                }
            }
            return {
                success: true,
                message: 'Post updated successfully',
                data: result.rows[0]
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

    static async getAllPosts(filterData){
        const client = await pool.connectDb();
        try{
            // Filter by Category filterData = {"filters": "categoryName1,categoryName2"} 
           const searchFilter = filterData.searchfilter;
            let query = `SELECT * FROM posts`;
            let values = [];
            let index = 1;

            // 1. Create an array to hold individual WHERE clauses
            const conditions = [];

            if (searchFilter) {
                conditions.push(`(title LIKE $${index} OR description LIKE $${index + 1})`); 
                values.push(`%${searchFilter.charAt(0).toUpperCase() + searchFilter.slice(1)}%`);
                values.push(`%${searchFilter}%`);
                index += 2;
            }

            if (filterData.filters) {
                const categories = filterData.filters.split(",");
                conditions.push(`string_to_array(cat_id, ',') && $${index}`);
                values.push(categories);
                index++;
            }

            // 2. Append WHERE only if there is at least one condition
            if (conditions.length > 0) {
                query += ` WHERE ` + conditions.join(' AND ');
            }

            query = {
                text: query,
                values: values
            };
            const result = await client.query(query);
            if(result.rows.length === 0){
                return {
                    success: false,
                    message: 'Post not found',
                    data: []
                }
            }
            for (let i = 0; i < result.rows.length; i++) {
                const attachmentResult = await client.query(
                    `SELECT * FROM attachments WHERE id = $1`,
                    [result.rows[i].attachment_id]
                );
                if(attachmentResult.rows.length !== 0){
                    result.rows[i].post_image_url = "http://localhost:5000/" + attachmentResult.rows[0].file_url;
                }
                //use usermodel to get user by id
                const userResult = await UserModel.getUserByID(result.rows[i].author_id);
                if(userResult.success){
                    result.rows[i].author = userResult.data;
                }
                result.rows[i].categories = await Promise.all(
                    result.rows[i].cat_id.split(',').map(async (catId) => {
                        const categoryResult = await client.query(
                            `SELECT * FROM post_categories WHERE id = $1`,
                            [catId]
                        );
                        return categoryResult.rows[0];
                    })
                );
                result.rows[i].tags = await Promise.all(
                    result.rows[i].tag_id.split(',').map(async (tagId) => {
                        const tagResult = await client.query(
                            `SELECT * FROM post_tags WHERE id = $1`,
                            [tagId]
                        );
                        return tagResult.rows[0];
                    })
                );
                delete result.rows[i].cat_id;
                delete result.rows[i].tag_id;
                delete result.rows[i].attachment_id;
                delete result.rows[i].author_id;
            }
            // Get All Categories
            const categoriesResult = await client.query(
                `SELECT * FROM post_categories`
            );
            
            return {
                success: true,
                message: 'Post found successfully',
                data: {
                    posts: result.rows,
                    categories: categoriesResult.rows
                }
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

    static async getPostBySlug(slug){
        const client = await pool.connectDb();
        try{
            const query = {
                text: `SELECT * FROM posts WHERE slug = $1`,
                values: [slug]
            }
            const result = await client.query(query);
            if(result.rows.length === 0){
                return {
                    success: false,
                    message: 'Post not found',
                    data: []
                }
            }
            const attachmentResult = await client.query(
                `SELECT * FROM attachments WHERE id = $1`,
                [result.rows[0].attachment_id]
            );
            if(attachmentResult.rows.length !== 0){
                result.rows[0].post_image_url = "http://localhost:5000/" + attachmentResult.rows[0].file_url;
            }
            //use usermodel to get user by id
            const userResult = await UserModel.getUserByID(result.rows[0].author_id);
            if(userResult.success){
                result.rows[0].author = userResult.data;
            }
            result.rows[0].categories = await Promise.all(
                result.rows[0].cat_id.split(',').map(async (catId) => {
                    const categoryResult = await client.query(
                        `SELECT * FROM post_categories WHERE id = $1`,
                        [catId]
                    );
                    return categoryResult.rows[0];
                })
            );
            result.rows[0].tags = await Promise.all(
                result.rows[0].tag_id.split(',').map(async (tagId) => {
                    const tagResult = await client.query(
                        `SELECT * FROM post_tags WHERE id = $1`,
                        [tagId]
                    );
                    return tagResult.rows[0];
                })
            );
             // Next Post
             const QN = `SELECT slug, title, created_at, 'next' AS direction
                FROM posts
                WHERE created_at > (SELECT created_at FROM posts WHERE slug = $1)
                ORDER BY created_at ASC
                LIMIT 1`;
                const nextPost = await client.query(QN, [result.rows[0].slug]);
                if(nextPost.rows.length !== 0){
                    result.rows[0].next_post = nextPost.rows[0];
                }
             // Previous Post
             const QP = `SELECT slug, title, created_at, 'previous' AS direction
                FROM posts
                WHERE created_at < (SELECT created_at FROM posts WHERE slug = $1)
                ORDER BY created_at DESC
                LIMIT 1`;
                const prevPost = await client.query(QP, [result.rows[0].slug]);
                if(prevPost.rows.length !== 0){
                    result.rows[0].prev_post = prevPost.rows[0];
                }
            delete result.rows[0].cat_id;
            delete result.rows[0].tag_id;
            delete result.rows[0].attachment_id;
            delete result.rows[0].author_id;
            return {
                success: true,
                message: 'Post found successfully',
                data: result.rows[0]
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

module.exports = PostModel;