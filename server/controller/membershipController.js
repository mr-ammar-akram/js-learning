const MembershipModel = require('../models/membershipModel');
const ProfileModel = require('../models/profileModel');

class MembershipController {
    static async addMembership(req, res) {
        try {
            if(!req.file){
                return res.status(400).json({
                    success: false,
                    message: "Please upload attachment",
                    data: []
                });
            }
            const imageRes = await ProfileModel.addCategoryImage(req.file);
            if(imageRes.success){
                const result = await MembershipModel.addMembership(req.body, imageRes.data);
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
        } else {
            res.status(500).json({
                success: false,
                message: imageRes.message,
                data: imageRes.data
            });
        }
        } catch (error) {
            res.status(500).json({
                status_code: 500,
                status: 'error',
                message: error.message,
                data: []
            });
        }
    }

    static async getAllMemberships(req,res){
        try {
            const result = await MembershipModel.getAllMemberships();
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
                status_code: 500,
                status: 'error',
                message: error.message,
                data: []
            });
        }
    }

    static async getMemberships(req,res){
        try {
            const result = await MembershipModel.getMemberships();
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
                status_code: 500,
                status: 'error',
                message: error.message,
                data: []
            });
        }
    }

    static async getMembershipById(req,res){
        try {
            const result = await MembershipModel.getMembershipById(req.params.id);
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
                status_code: 500,
                status: 'error',
                message: error.message,
                data: []
            });
        }
    }

    static async updateMembership(req,res){
        try {
            let imageRes, result;
            if(req.file){
                imageRes = await ProfileModel.addCategoryImage(req.file);
                result = await MembershipModel.updateMembership(req.params.id, req.body, imageRes.data);
            }else{
                result = await MembershipModel.updateMembership(req.params.id, req.body, req.body.attachment_id);
            }
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
                status_code: 500,
                status: 'error',
                message: error.message,
                data: []
            });
        }
    }

    static async deleteMembership(req,res){
        try {
            const result = await MembershipModel.deleteMembership(req.params.id);
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
                status_code: 500,
                status: 'error',
                message: error.message,
                data: []
            });
        }
    }
}

module.exports = MembershipController;
