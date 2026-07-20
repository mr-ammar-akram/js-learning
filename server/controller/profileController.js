const ProfileModel = require('../models/profileModel');

class ProfileController {
    static async profileImage(req, res){
        try{
            const result = await ProfileModel.profileImage(req.file, req.body.user_id);
            if(result.success){
                return res.status(200).json({
                    status_code: 200,
                    status: 'success',
                    message: result.message,
                    data: result.data
                });
            }else{
                return res.status(400).json({
                    status_code: 400,
                    status: 'error_err',
                    message: result.message,
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


    static async getProfileImage (req, res){
        const { user_id } = req.body;
        try{
            const response = await ProfileModel.getProfileImage(user_id);
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
module.exports = ProfileController;
