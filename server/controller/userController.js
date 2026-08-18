const UserModel = require('../models/userModel');
const notificationController = require('../controller/notificationController');
const OtpModel = require('../models/otpModel');
const jwt = require("jsonwebtoken");

class UserController {
    static async  registerUser (req, res) {
        const { user_mail, user_full_name, user_name, user_password, user_phone } = req.body;
        try{
            const result = await UserModel.createUser({
                'userEmail':user_mail, 
                'userFullName': user_full_name,
                'userName': user_name, 
                'userPhone':user_phone,
                'userPassword':user_password
            });
            if(result.success){
                // send email to user
                const response = await notificationController.emailVerify(result.data.user_email, result.data.user_name, result.data.id);
                //embed response in result.data
                result.data.otp_verification = response;
                return res.status(200).json({
                        status_code: 200,
                        status: 'success',
                        message: result.message, 
                        data: result.data

                });
            }else{
                return res.status(400).json({
                    status_code: 400,
                    status: "error",
                    message: result.message,
                    data: [],
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

    static async loginUser(req, res) {
        const { user_email_phone, user_password } = req.body;

        try{
            const response = await UserModel.authenticateUser({
                user_email: user_email_phone, 
                user_password: user_password
            });
            if(response.success){
                // generate jwt token
                const token = jwt.sign(response.user, process.env.JWT_SECRET, { expiresIn: '1h' });
                response.token = token;
                return res.status(200).json({
                    status_code: 200,
                    status: 'success',
                    message: "User logged in successfully", 
                    data: response
                });
            }else{
                if(response.code){
                    return res.status(400).json({ 
                        status_code: 400,
                        status: 'error',
                        message: response.message,
                        data: []
                    });
                }else{
                    if(response.status === 'not_verified'){
                        // send email to user
                        const emailResponse = await notificationController.emailVerify(response.user.user_email, response.user.user_name, response.user.id);
                        //embed response in result.data
                        response.user.otp_verification = emailResponse;
                        // generate jwt token
                        const token = jwt.sign(response.user, process.env.JWT_SECRET, { expiresIn: '1h' });
                        response.user.token = token;
                        return res.status(401).json({ 
                            status_code: 401,
                            status: 'not_verified',
                            message: response.message,
                            data: response.user
                        });
                    }
                    return res.status(401).json({ 
                        status_code: 401,
                        status: 'unauthorize',
                        message: response.message,
                        data: []
                    });
                }
            }
        }catch(err){
            res.status(500).json({
                status_code: 500,
                status: 'internal_server_error',
                message: err.message
            });
        }
    }

    static async  getUser (req, res) {
        const { user_id } = req.params; 
        try{
        const response = await UserModel.getUserByID(user_id);
            if(response.success){
                return res.status(200).json({
                    status_code: 200,
                    status: 'success',
                    message: response.message, 
                    data: response.data
                });
            }else{
                return res.status(400).json({
                    status_code: 400,
                    status: 'error',
                    message: response.message, 
                    data: []
                })  
            }
        }catch(error){
            res.status(500).json({
                status_code: 500,
                status: 'internal_server_error',
                message: error.message
            });
        }
    }

    static async verifyOTP (req, res){
        const { otp } = req.body;
        try{
            const response = await OtpModel.verifyOTP(otp);
            if(response.success){
                return res.status(200).json({
                    status_code: 200,
                    status: 'success',
                    message: response.message,
                    data: response.data
                });
            }else{
                return res.status(400).json({
                    status_code: 400,
                    status: 'error',
                    message: response.message,
                    data: []
                });
            }
        }catch(error){
            res.status(500).json({
                status_code: 500,
                status: 'internal_server_error',
                message: error.message
            });
        }
    }    

    static async resendOTP (req, res){
        const { user_email, user_name, user_id } = req.body;
        try{
            // send email to user
            const response = await notificationController.emailVerify(user_email, user_name, user_id);
            if(response.success){
                return res.status(200).json({
                    status_code: 200,
                    status: 'success',
                    message: response.message, 
                    data: response.data
                }); 
            }else{
                return res.status(400).json({
                    status_code: 400,
                    status: 'error',
                    message: response.message, 
                    data: []
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

    // Get All Users
    static async  getAllUsers (req, res) {
        try{
        const response = await UserModel.getAllUsers();
            if(response.success){
                return res.status(200).json({
                    status_code: 200,
                    status: 'success',
                    message: response.message, 
                    data: response.data
                });
            }else{
                return res.status(400).json({
                    status_code: 400,
                    status: 'error',
                    message: response.message, 
                    data: []
                })  
            }
        }catch(error){
            res.status(500).json({
                status_code: 500,
                status: 'internal_server_error',
                message: error.message
            });
        }
    }

    static async deleteUser (req, res) {
        const { id } = req.params; 
        try{
            const response = await UserModel.deleteUserByID(id);
            if(response.success){
                return res.status(200).json({
                    status_code: 200,
                    status: 'success',
                    message: response.message, 
                    data: response.data
                });
            }else{
                return res.status(400).json({
                    status_code: 400,
                    status: 'error',
                    message: response.message, 
                    data: []
                })  
            }
        }catch(error){
            res.status(500).json({
                status_code: 500,
                status: 'internal_server_error',
                message: error.message
            });
        }
    }

    static async updateUser (req, res){
        const { id } = req.params; 
        try{
            const response = await UserModel.updateUserByID(id, req.body);
            if(response.success){
                return res.status(200).json({
                    status_code: 200,
                    status: 'success',
                    message: response.message, 
                    data: response.data
                });
            }else{
                return res.status(400).json({
                    status_code: 400,
                    status: 'error',
                    message: response.message, 
                    data: []
                })  
            }
        }catch(error){
            res.status(500).json({
                status_code: 500,
                status: 'internal_server_error',
                message: error.message
            });
        }
    }
}

module.exports = UserController;