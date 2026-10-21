const { json } = require('express');
const pool = require('../models/db_learning');
const baseUrl = process.env.BASE_URL;

class MembershipModel {
    static async addMembership(data, attachment_id) {
        const client = await pool.connectDb();
        try {
            const query = `INSERT INTO memberships (title, description, plan, duration , attachment_id ) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
            const values = [data.title, data.description, data.plan, data.duration, attachment_id];
            const result = await client.query(query, values);
            return {
                success: true,
                message: 'Membership added successfully',
                data: result.rows[0]
            };
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }

    static async getAllMemberships() {
        const client = await pool.connectDb();
        try {
            const query = `SELECT * FROM memberships`;
            const result = await client.query(query);
            return {
                success: true,
                message: 'Memberships fetched successfully',
                data: result.rows
            };
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }


    static async getMemberships() {
        const client = await pool.connectDb();
        try {
            const query = `SELECT * FROM memberships`;
            const result = await client.query(query);
            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: 'No memberships found',
                    data: []
                };
            }
            for (let i = 0; i < result.rows.length; i++) {
                const query2 = `SELECT * FROM membership_plans WHERE id = $1`;
                const values2 = [result.rows[i].plan];
                const result2 = await client.query(query2, values2);
                result.rows[i].plans = result2.rows;
            }
            return {
                success: true,
                message: 'Memberships fetched successfully',
                data: result.rows
            };
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }

    static async getMembershipById(id) {
        const client = await pool.connectDb();
        try {
            const query = `SELECT * FROM memberships WHERE id = $1`;
            const values = [id];
            const result = await client.query(query, values);
            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: 'Membership not found',
                    data: []
                };
            }
            if (result.rows[0].attachment_id !== null) {
                const imageQuery = {
                    text: `SELECT * FROM attachments WHERE id = $1`,
                    values: [result.rows[0].attachment_id]
                }
                const imageResult = await client.query(imageQuery);
                if(imageResult.rows.length === 0){
                    result.rows[0].file_url = "";
                }
                result.rows[0].file_url = baseUrl + imageResult.rows[0].file_url;
            }
            return {
                success: true,
                message: 'Membership fetched successfully',
                data: result.rows[0]
            };
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }

    static async updateMembership(id, data) {
        const client = await pool.connectDb();
        try {
            const query = `UPDATE memberships SET title = $1, description = $2, plan = $3, duration = $4, attachment_id = $5 WHERE id = $6 RETURNING *`;
            const values = [data.title, data.description, data.plan, data.duration, data.attachment_id, id];
            const result = await client.query(query, values);
            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: 'Membership not updated',
                    data: []
                };
            }
            return {
                success: true,
                message: 'Membership updated successfully',
                data: result.rows[0]
            };
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }

    static async deleteMembership(id) {
        const client = await pool.connectDb();
        try {
            const query = `DELETE FROM memberships WHERE id = $1 RETURNING *`;
            const values = [id];
            const result = await client.query(query, values);
            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: 'Membership not deleted',
                    data: []
                };
            }
            return {
                success: true,
                message: 'Membership deleted successfully',
                data: result.rows[0]
            };
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }

}

module.exports = MembershipModel;