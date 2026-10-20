const LikeModel = require("../models/likeModel");

class LikeController {
      static async addLike(req, res) {
            try {
                const result = await LikeModel.addLike(req.body);
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
}
module.exports = LikeController;