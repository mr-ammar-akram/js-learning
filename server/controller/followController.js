const followModel = require("../models/followModel");
const notificationController = require("./notificationController"); 

class FollowController {
    static async follow(req, res) {
        try {
            const response = await followModel.follow(req.body);
            if(response.success && response.status === 'follow'){
                const notificationResponse = await notificationController.addNotification(response.data);
                response.data.mail_response = notificationResponse;
            }
            res.json(response);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                data: []
            })
        }
    }
}

module.exports = FollowController;