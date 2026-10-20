const commentModel = require("../models/commentModel");

class commentController {
    static async getAllComments(req, res) {
        try {
            const result = await commentModel.getAllComments();
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message,
                    data: []
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                data: []
            });
        }
    }
    static async addComment(req, res) {
        try {
            const result = await commentModel.addComment(req.body);
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message,
                    data: []
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                data: []
            });
        }
    }
    static async replyComment(req, res){
        try{
            const result = await commentModel.replyComment(req.body);
            if(result.success){
                res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data
                });
            }else{
                res.status(400).json({
                    success: false,
                    message: result.message,
                    data: []
                });
            }
        }catch(error){
            res.status(500).json({
                success: false,
                message: error.message,
                data: []
            });
        }
    }

    static async updateComment(req, res){
        try{
            const result = await commentModel.updateComment(req.body);
            if(result.success){
                res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data
                });
            }else{
                res.status(400).json({
                    success: false,
                    message: result.message,
                    data: []
                });
            }
        }catch(error){
            res.status(500).json({
                success: false,
                message: error.message,
                data: []
            });
        }
    }
}
module.exports = commentController;