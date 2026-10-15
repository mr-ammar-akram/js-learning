const CategoryModel = require('../models/categoryModel');
const ProfileModel = require('../models/profileModel');

class CategoryController {
    static async addCategory(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    status_code: 400,
                    status: 'error',
                    message: 'Image is required',
                    data: []
                });
            }
            const imgRes = await ProfileModel.addCategoryImage(req.file);
            if (imgRes.success) {
                const result = await CategoryModel.addCategory(req.body, imgRes.data);
                if (result.success) {
                    return res.status(200).json({
                        status_code: 200,
                        status: 'success',
                        message: result.message,
                        data: result.data
                    });
                } else {
                    return res.status(400).json({
                        status_code: 400,
                        status: 'error',
                        message: result.message,
                        data: []
                    });
                }
            } else {
                return res.status(400).json({
                    status_code: 400,
                    status: 'error',
                    message: imgRes.message,
                    data: []
                });
            }
        } catch (error) {
            res.status(500).json({
                status_code: 500,
                status: 'internal_server_error',
                message: error.message
            });
        }
    }
    static async getAllCategories(req, res) {
        try {
            const result = await CategoryModel.getCategories(req.body);
            if (result.success) {
                return res.status(200).json({
                    status_code: 200,
                    status: 'success',
                    message: result.message,
                    data: result.data
                });
            } else {
                return res.status(400).json({
                    status_code: 400,
                    status: 'error',
                    message: result.message,
                    data: []
                });
            }
        } catch (error) {
            res.status(500).json({
                status_code: 500,
                status: 'internal_server_error',
                message: error.message
            });
        }
    }

    static async deleteCategory(req, res) {
        try {
            const result = await CategoryModel.deleteCategory(req.params.id);
            if (result.success) {
                return res.status(200).json({
                    status_code: 200,
                    status: 'success',
                    message: result.message,
                    data: result.data
                });
            } else {
                return res.status(400).json({
                    status_code: 400,
                    status: 'error',
                    message: result.message,
                    data: []
                });
            }
        } catch (error) {
            res.status(500).json({
                status_code: 500,
                status: 'internal_server_error',
                message: error.message
            });
        }
    }
     static async getCategoryById(req, res){
        try {
            const result = await CategoryModel.getCategoryById(req.params.id);
            if (result.success) {
                return res.status(200).json({
                    status_code: 200,
                    status: 'success',
                    message: result.message,
                    data: result.data
                });
            } else {
                return res.status(400).json({
                    status_code: 400,
                    status: 'error',
                    message: result.message,
                    data: []
                });
            }
        } catch (error) {
            res.status(500).json({
                status_code: 500,
                status: 'internal_server_error',
                message: error.message
            });
        }
     }
     
     static async updateCategory(req, res){
        try {
            let imgRes;
            let result;
            if(req.file){
                imgRes = await ProfileModel.addCategoryImage(req.file);
                result = await CategoryModel.updateCategory(req.params.id, req.body, imgRes.data);
            }else{
                result = await CategoryModel.updateCategory(req.params.id, req.body, req.body.attachment_id);
            }
            if (result.success) {
                return res.status(200).json({
                    status_code: 200,
                    status: 'success',
                    message: result.message,
                    data: result.data
                });
            } else {
                return res.status(400).json({
                    status_code: 400,
                    status: 'error',
                    message: result.message,
                    data: []
                });
            }
        } catch (error) {
            res.status(500).json({
                status_code: 500,
                status: 'internal_server_error',
                message: error.message
            });
        }
     }
}

module.exports = CategoryController;
