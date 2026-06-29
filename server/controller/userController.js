const UserModel = require('../models/userModel');
const jwt = require("jsonwebtoken");

class UserController {
    static async  registerUser (req, res) {
        const { user_mail, user_name, user_password, user_phone } = req.body;

        try{
            const result = await UserModel.createUser({
                'userEmail':user_mail, 
                'userName': user_name, 
                'userPhone':user_phone,
                'userPassword':user_password
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
    
}

module.exports = UserController;