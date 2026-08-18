const PostModel = require('../models/postModel');
const ProfileModel = require('../models/profileModel');

class PostController {
    static async addPost(req, res){
        try {
            // check if profile exists
            if(!req.file){
                return res.status(400).json({
                    status_code: 400,
                    status: 'error',
                    message: "File is required",
                    data: []
                });
            }
            const imgRes = await ProfileModel.addCategoryImage(req.file);
            if(imgRes.success){
                const result = await PostModel.addPostData(req.body, imgRes.data);
                if (result.success) {
                    res.status(200).json({
                        success: true,
                        message: result.message,
                        data: result.data
                    });
                } else {
                    res.status(500).json({
                        success: false,
                        message: result.message,
                        data: result.data
                    });
                }
            }else{
                return res.status(400).json({
                    status_code: 400,
                    status: 'error',
                    message: imgRes.message,
                    data: []
                });
            }
        }catch (error) {
            res.status(500).json({
                status_code: 500,
                status: 'error',
                message: error.message,
                data: []
            });
        }
    }

    static async getPosts(req, res){
        try {
            const result = await PostModel.getPosts();
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: result.message,
                    data: result.data
                });
            }
        }catch (error) {
            res.status(500).json({
                status_code: 500,
                status: 'error',
                message: error.message,
                data: []
            });
        }
    }

    static async deletePost(req, res){
        try{
            const result = await PostModel.deletePost(req.params.id);
            if(result.success){
                res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data
                });
            }else{
                res.status(500).json({
                    success: false,
                    message: result.message,
                    data: result.data
                });
            }
        }catch(error){
            res.status(500).json({
                status_code: 500,
                status: 'error',
                message: error.message,
                data: []
            });
        }
    }

    static async getPost(req,res){
        try{
            const result = await PostModel.getPost(req.params.id);
            if(result.success){
                res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data
                });
            }else{
                res.status(500).json({
                    success: false,
                    message: result.message,
                    data: result.data
                });
            }
        }catch(error){
            res.status(500).json({
                status_code: 500,
                status: 'error',
                message: error.message,
                data: []
            });
        }
    }

    static async updatePost (req, res){
        try{
            let imageRes, result;
            if(req.file){
                imageRes = await ProfileModel.addCategoryImage(req.file);
                result = await PostModel.updatePost(req.params.id, req.body, imageRes.data);
            }else{
                result = await PostModel.updatePost(req.params.id, req.body, req.body.attachment_id);
            }
            if(result.success){
                res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data
                });
            }else{
                res.status(500).json({
                    success: false,
                    message: result.message,
                    data: result.data
                });
            }
        }catch(error){
            res.status(500).json({
                status_code: 500,
                status: 'error',
                message: error.message,
                data: []
            });
        }
    }

    static async getAllPosts (req, res){
        try{
            const result = await PostModel.getAllPosts(req.body);
            if(result.success){
                res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data
                });
            }else{
                res.status(500).json({
                    success: false,
                    message: result.message,
                    data: result.data
                });
            }
        }catch(error){
            res.status(500).json({
                status_code: 500,
                status: 'error',
                message: error.message,
                data: []
            });
        }
    }

    static async getPostBySlug(req, res){
        try{
            const result = await PostModel.getPostBySlug(req.params.slug);
            if(result.success){
                res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data
                });
            }else{
                res.status(500).json({
                    success: false,
                    message: result.message,
                    data: result.data
                });
            }
        }catch(error){
            res.status(500).json({
                status_code: 500,
                status: 'error',
                message: error.message,
                data: []
            });
        }
    }
}

module.exports = PostController;
