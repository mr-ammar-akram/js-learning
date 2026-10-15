const pool = require('../models/db_learning');

class PlanModel {
    static async addPlan(data) {
            const client = await pool.connectDb();
        try {
            const query = `
                INSERT INTO membership_plans (name, amount) VALUES ($1, $2) RETURNING * 
            `
            const values = [data.name, data.amount]
            const result = await client.query(query, values);
            if(result.rows.length === 0){
                return {
                    success: false,
                    message: "Plan not added",
                    data: []
                }
            }
            return {
                success: true,
                message: "Plan added successfully",
                data: result.rows[0]
            }
        } catch (error) {
            return {
                success: false,
                message: "Plan not added",
                data: error.message
            }
        }finally{
            client.release();
        }
    }

    static async getAllPlans() {
        const client = await pool.connectDb();
        try {
            const result = await client.query('SELECT * FROM membership_plans');
            if(result.rows.length === 0){
                return {
                    success: false,
                    message: "Plan not found",
                    data: []
                }
            }
            return {
                success: true,
                message: "Plan found successfully",
                data: result.rows
            }
        } catch (error) {
            return {
                success: false,
                message: "Plan not found",
                data: error.message
            }
        }finally{
            client.release();
        }
    }

    static async getPlanById(data) {
        const client = await pool.connectDb();
        try {
            const result = await client.query('SELECT * FROM membership_plans WHERE id = $1', [data.id]);
            if(result.rows.length === 0){
                return {
                    success: false,
                    message: "Plan not found",
                    data: []
                }
            }
            return {
                success: true,
                message: "Plan found successfully",
                data: result.rows[0]
            }
        } catch (error) {
            return {
                success: false,
                message: "Plan not found",
                data: error.message
            }
        }finally{
            client.release();
        }
    }

    static async updatePlan(planId, data) {
        const client = await pool.connectDb();
        try {
            const { name, amount } = data;
            const { id } = planId;
            const result = await client.query('UPDATE membership_plans SET name = $1, amount = $2 WHERE id = $3 RETURNING *', [name, amount, id]);
            if(result.rows.length === 0){
                return {
                    success: false,
                    message: "Plan not updated",
                    data: []
                }
            }
            return {
                success: true,
                message: "Plan updated successfully",
                data: result.rows[0]
            }
        } catch (error) {
            return {
                success: false,
                message: "Plan not updated",
                data: error.message
            }
        }finally{
            client.release();
        }
    }

    static async deletePlan(data) {
        const client = await pool.connectDb();
        try {
            const query = `DELETE FROM membership_plans WHERE id = $1;`
            const values = [data.id];
            const result = await client.query(query, values);
            if(result.rows.length !== 0){
                return {
                    success: false,
                    message: "Plan not deleted",
                    data: []
                }
            }
            return {
                success: true,
                message: "Plan deleted successfully",
                data: result.rows[0]
            }
        } catch (error) {
            return {
                success: false,
                message: "Plan not deleted",
                data: error.message
            }
        }finally{
            client.release();
        }
    }
}

module.exports = PlanModel;
