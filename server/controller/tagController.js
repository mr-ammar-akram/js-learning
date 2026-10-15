const TagModel = require('../models/tagModel');

class TagController {
    static async addCatTag(req, res) {
        try {
            const result = await TagModel.addTag(req.body);
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
        } catch (error) {`
            res.status(500).json({
                success: false,
                message: error.message,
                data: []
            });`
        }
    }

    static async getAllTags(req, res){
        try {
            const result = await TagModel.getTags();
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
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                data: []
            });
        }
    }

    static async deleteTag(req, res) {
        try {
            const result = await TagModel.deleteTag(req.params.id);
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
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                data: []
            });
        }
    }

    static async getTagById(req, res){
        try {
            const result = await TagModel.getTagById(req.params.id);
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
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                data: []
            });
        }
    }

    static async updateTag(req, res){
        try{
            const result = await TagModel.updateTag(req.params.id, req.body);
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

module.exports = TagController;