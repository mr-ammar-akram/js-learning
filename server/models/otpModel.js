const pool = require('../models/db_learning'); 
const UserModel = require('../models/userModel');

class OtpModel {
    static async storeOTP(user_id, OTP) {
        const expiresAt = new Date(Date.now() + 60 * 1000); 
        const client = await pool.connectDb();
        try {
            const query = `INSERT INTO otps (user_id, otp, expired_at) VALUES ($1, $2, $3) RETURNING *`;
            const values = [user_id, OTP, expiresAt];
            const result = await client.query(query, values);
            return {
                success: true,
                message: 'OTP created successfully',
                data: result.rows[0]
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: []
            };
        } finally {
            client.release();
        }
    }
    static async verifyOTP(otp) {
        const client = await pool.connectDb();
        try {
            const query = `SELECT * FROM otps WHERE otp = $1`;
            const result = await client.query(query, [otp]);
            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: 'OTP not found',
                    data: []
                };
            }
            if (result.rows[0].status === 'used') {
                return {
                    success: false,
                    message: 'OTP has already been used',
                    data: []
                };
                
            }   
            if (result.rows[0].status === 'expired') {
                return {
                    success: false,
                    message: 'OTP has expired',
                    data: []
                };
            }
            const now = new Date();
            const expiresAt = new Date(result.rows[0].expired_at);
            if (now > expiresAt) {
                await OtpModel.updateOTPStatus(result.rows[0].id, 'expired');
                return {
                    success: false,
                    message: 'OTP has expired',
                    data: []
                };
            }
            await OtpModel.updateOTPStatus(result.rows[0].id, 'used');
            await UserModel.updateStatus(result.rows[0].user_id, true);
            return {
                success: true,
                message: 'OTP verified successfully',
                data: result.rows[0]
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: []
            };
        } finally {
            client.release();
        }
    }    
    static async updateOTPStatus(otpID, status) {
        const client = await pool.connectDb();
        try {
            const query = `UPDATE otps SET status = $1 WHERE id = $2 RETURNING *`;
            const result = await client.query(query, [status, otpID]);
            return {
                success: true,
                message: 'OTP status updated successfully',
                data: result.rows[0]
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: []
            };
        } finally {
            client.release();
        }
    }
}
module.exports = OtpModel;    
