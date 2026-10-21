const { json } = require('express');
const pool = require('../models/db_learning');
const UserModel = require('./userModel');
const baseUrl = process.env.BASE_URL;

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
            result.rows[0].post_image_url = baseUrl + imageResult.rows[0].file_url;
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
                    result.rows[i].post_image_url = baseUrl + attachmentResult.rows[0].file_url;
                }
                //use usermodel to get user by id
                const userResult = await UserModel.getUserByID(result.rows[i].author_id);
                if(userResult.success){
                    result.rows[i].author = userResult.data;
                }
                //get likes and dislikes count
                const likesResult = await client.query(
                    `SELECT COUNT(*) FROM post_likes WHERE post_id = $1 AND post_like = 1`,
                    [result.rows[i].id]
                );
                const dislikesResult = await client.query(
                    `SELECT COUNT(*) FROM post_likes WHERE post_id = $1 AND post_like = -1`,
                    [result.rows[i].id]
                );
                result.rows[i].likes = likesResult.rows[0].count;
                result.rows[i].dislikes = dislikesResult.rows[0].count; 
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

    static async getPostBySlug(slug, currentUserId){
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
                result.rows[0].post_image_url = baseUrl + attachmentResult.rows[0].file_url;
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
            
            // I need only followers count and is follow
            const followerQuery = {
                text: `SELECT
                COUNT(*) FILTER (WHERE follow_status = 1) AS follower_count,
                MAX(follow_status) FILTER (WHERE follower_id = $2) AS is_follow
            FROM followers
            WHERE following_id = $1 AND follow_status != 0`,
                values: [result.rows[0].author_id, currentUserId]
            };
            const followerResult = await client.query(followerQuery);
            result.rows[0].follower_count = parseInt(
                followerResult.rows[0].follower_count,
                10
            );
            // return true or false
            result.rows[0].is_follow = followerResult.rows[0].is_follow == 1 ? true : false;
            delete result.rows[0].author_id;
            const likeQuery = `
                SELECT
                    COUNT(*) FILTER (WHERE post_like = 1) AS like_count,
                    COUNT(*) FILTER (WHERE post_like = -1) AS dislike_count,
                    COALESCE(
                        MAX(post_like) FILTER (WHERE user_id = $2),
                        0
                    ) AS user_reaction
                FROM post_likes
                WHERE post_id = $1 
            `;

            const likeValues = [
                result.rows[0].id,
                currentUserId
            ];

            const likeResult = await client.query(likeQuery, likeValues);

            result.rows[0].like_count = parseInt(
                likeResult.rows[0].like_count,
                10
            );

            result.rows[0].dislike_count = parseInt(
                likeResult.rows[0].dislike_count,
                10
            );

            result.rows[0].user_reaction = parseInt(
                likeResult.rows[0].user_reaction,
                10
            );
           // 1. Get ALL comments/replies of this post in a SINGLE database query
            const commentQuery = `
                SELECT * FROM posts_comments WHERE post_id = $1 ORDER BY created_at ASC
            `;
            const commentValues = [result.rows[0].id];
            const commentResult = await client.query(commentQuery, commentValues);

            if (commentResult.rows.length > 0) {
                // 2. Fetch all user data in parallel first to avoid doing queries inside a nested tree loop
                const allCommentsWithUsers = await Promise.all(
                    commentResult.rows.map(async (comment) => {
                        // Setup an empty array for replies on EVERY comment automatically
                        comment.replies = [];
                        
                        const likeQuery = `
                        SELECT
                            COUNT(*) FILTER (WHERE post_like = 1) AS like_count,
                            COALESCE(
                                MAX(post_like) FILTER (WHERE user_id = $2),
                                0
                            ) AS user_reaction
                        FROM post_likes
                        WHERE comment_id = $1 
                    `;

                    const likeValues = [
                        comment.id,
                        currentUserId
                    ];

                    const likeResult = await client.query(likeQuery, likeValues);

                    comment.like_count = parseInt(
                        likeResult.rows[0].like_count,
                        10
                    );
                    comment.user_reaction = parseInt(
                        likeResult.rows[0].user_reaction,
                        10
                    );
                    // user can edit comment if comment.user_id == currentUserId 
                    if (comment.user_id == currentUserId) {
                        comment.user_can_edit = true;
                    } else {
                        comment.user_can_edit = false;
                    }
                    

                        // Attach user data securely
                        const userResult = await UserModel.getUserByID(comment.user_id);
                        if (userResult.success) {
                            delete userResult.data.password;
                            delete userResult.data.user_role;
                            delete userResult.data.is_verified;
                            delete userResult.data.attachment_id;
                            comment.user = userResult.data;
                        }
                        return comment;
                    })
                );

                // 3. Create a quick lookup map using comment IDs
                const commentMap = {};
                allCommentsWithUsers.forEach(comment => {
                    commentMap[comment.id] = comment;
                });

                const rootCommentsTree = [];

                // 4. Build an INFINITE tree structure recursively using references
                allCommentsWithUsers.forEach(comment => {
                    if (comment.parent_id !== null && comment.parent_id !== undefined) {
                        // Find its direct parent comment inside our map
                        const parentComment = commentMap[comment.parent_id];
                        if (parentComment) {
                            // This handles replies, replies of replies, replies of replies of replies, etc.
                            parentComment.replies.push(comment);
                        }
                    } else {
                        // This is a top-level root comment
                        rootCommentsTree.push(comment);
                    }
                });



                // 5. Attach the completed tree to your post object (reversed if you want newest first)
                result.rows[0].comments = rootCommentsTree.reverse();
            } else {
                result.rows[0].comments = [];
            }

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

    static async getAllPostsUser(filterData){
        const client = await pool.connectDb();
        try{
            let query = `SELECT * FROM posts WHERE author_id = $1`;
            let values = [filterData.user_id];
            const result = await client.query(query, values);
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
}

module.exports = PostModel;