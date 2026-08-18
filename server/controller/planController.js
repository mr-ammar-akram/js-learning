const PlanModel = require("../models/planModel");

class PlanController {


    static async addPlan(req, res) {
        try {
            const result = await PlanModel.addPlan(req.body);
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

    static async getAllPlans(req, res) {
        try {
            const result = await PlanModel.getAllPlans();
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
                })
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                data: []
            });
        }
    }

    static async getPlanById(req, res) {
        try {
            const result = await PlanModel.getPlanById(req.params);
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

    static async updatePlan(req, res) {
        try {
            const result = await PlanModel.updatePlan(req.params, req.body);
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

    static async deletePlan(req, res) {
        try {
            const result = await PlanModel.deletePlan(req.params);
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

module.exports = PlanController;