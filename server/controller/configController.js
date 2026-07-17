const ConfigModel = require('../models/configModel');
const notificationController = require('../controller/notificationController');

class ConfigController {
    static async  adminRegister (req, res) {
        try{
            const result = await ConfigModel.createConfig(req.body);
            if(result.code){
                return res.status(400).json({
                    status_code: 400,
                    status: "error",
                    message: result.message,
                    data: [],
                });
            }else{
                let notificationResponse;
                if(result.user_phone){
                    notificationResponse = await notificationController.registerByAdminMail(result.user_email, result.user_name, result.id, req.body.user_password, result.user_role);
                } 
                delete result.user_password;
                result.mail_response = notificationResponse;
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