const ConfigModel = require('../models/configModel');
const jwt = require("jsonwebtoken");

class ConfigController {
    static async  adminRegister (req, res) {
        const { user_email, user_name, user_role, user_password } = req.body;
        try{
            const result = await ConfigModel.createConfig({
                'userEmail':user_email, 
                'userName': user_name, 
                'userRole':user_role,
                'userPassword':user_password,
                'is_verified':true
            });
            if(result.code){
                return res.status(400).json({
                    status_code: 400,
                    status: "error",
                    message: result.message,
                    data: [],
                });
            }else{
                return res.status(200).json({
                    status_code: 200,
                    status: 'success',
                    message: "User created successfully", 
                    data: result
                });
            }   
        }catch(err){
            return res.status(500).json({
                status_code: 500,
                status: "error",
                message: err.message,
                data: [],
            });
        }   
    }

    // controller to check if admin exist in users table
    static async checkAdminExist(req, res) {
        try {
            const response = await ConfigModel.checkAdminExists();
            if (response.success) {
                return res.status(200).json({
                    exists: true,
                    message: response.message,
                });
            } else {
                return res.status(404).json({
                    exists: false,
                    message: response.message,
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    }

}

module.exports = ConfigController;