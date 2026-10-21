
const pool = require('../models/db_learning');
const baseUrl = process.env.BASE_URL;

class PaymentModel {
    static async defaultPayment(userId) {
        const client = await pool.connectDb();
        try {
            const query = `INSERT INTO purchases (user_id, membership_id, plan_name, plan_amount, expiry_date) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
            const values = [userId, 3, "Trial", 0, new Date()];
            const result = await client.query(query, values);
            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: "No purchased plan found for this user.",
                    data: []
                };
            }
            return {
                success: true,
                message: "Purchased plan retrieved successfully.",
                data: result.rows[0]
            };
        } catch (error) {
            console.error("Error getting purchased plan:", error);
            return {
                success: false,
                message: "Internal server error.",
                data: []
            };
        } finally {
            client.release();
        }
    }
    static async addPayment(paymentData) {
        const client = await pool.connectDb();
        try {
            const checkDurationQuery = `SELECT duration FROM memberships WHERE id = $1`;
            const checkDurationValues = [paymentData.membership_id];
            const checkDurationResult = await client.query(checkDurationQuery, checkDurationValues);
            if (checkDurationResult.rows.length === 0) {
                return {
                    success: false,
                    message: "Membership not found.",
                    data: []
                };
            }
            // checkDurationResult.rows[0].duration = value is in days like 30,90,180, 365
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + Number(checkDurationResult.rows[0].duration));
            
            const query = `INSERT INTO purchases (stripe_payment_id, user_id, membership_id, plan_name, plan_amount, expiry_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
            const values = [paymentData.stripe_payment_id, paymentData.user_id, paymentData.membership_id, paymentData.plan_name, paymentData.amount, expiryDate];
            const result = await client.query(query, values);
            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: "Payment not added.",
                    data: []
                };
            }
            return {
                success: true,
                message: "Payment added successfully.",
                data: result.rows[0]
            };

        } catch (error) {
            console.error("Error adding payment:", error);
            return {
                success: false,
                message: "Internal server error.",
                data: []
            };
        }finally {
            client.release();
        }
    }

    static async getPaymentById(id) {
        const client = await pool.connectDb();
        try {
            const query = `SELECT * FROM purchases WHERE id = $1`;
            const values = [id];
            const result = await client.query(query, values); 
            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: "Payment not found.",
                    data: []
                };
            }
            const UserQuery = `SELECT * FROM users WHERE id = $1`;
            const UserValues = [result.rows[0].user_id];
            const UserResult = await client.query(UserQuery, UserValues);  
            if (UserResult.rows.length !== 0) {
                result.rows[0].user = UserResult.rows[0];
                delete result.rows[0].user.password;
                delete result.rows[0].user.user_id;
                
            }
            const MembershipQuery = `SELECT * FROM memberships WHERE id = $1`;
            const MembershipValues = [result.rows[0].membership_id];
            const MembershipResult = await client.query(MembershipQuery, MembershipValues);  
            if (MembershipResult.rows.length !== 0) {
                result.rows[0].membership = MembershipResult.rows[0];
                delete result.rows[0].membership.id;
            }
            const PlanQuery = `SELECT * FROM membership_plans WHERE id = $1`;
            const PlanValues = [MembershipResult.rows[0].plan];
            const PlanResult = await client.query(PlanQuery, PlanValues);  
            if (PlanResult.rows.length !== 0) {
                result.rows[0].plan = PlanResult.rows[0];
                delete result.rows[0].plan.id;
            }
            return {
                success: true,
                message: "Payment found successfully.",
                data: result.rows[0]
            };
        } catch (error) {
            console.error("Error getting payment:", error);
            return {
                success: false,
                message: "Internal server error.",
                data: []
            };
        }finally {
            client.release();
        }
    }

    // Get Purchased Plan by User ID
static async getPurchasedPlan(user_id) {
    const client = await pool.connectDb();
    try {
        const query = `SELECT * FROM purchases WHERE user_id = $1`;``
        const values = [user_id];
        const result = await client.query(query, values);
        
        if (result.rows.length === 0) {
            return {
                success: false,
                message: "No purchased plan found for this user.",
                data: []
            };
        }
        const UserQuery = `SELECT * FROM users WHERE id = $1`;
        const UserValues = [result.rows[0].user_id];
        const UserResult = await client.query(UserQuery, UserValues);       
        if (UserResult.rows.length !== 0) {
            result.rows[0].user = UserResult.rows[0];
            const userProfileQuery = `SELECT file_url FROM attachments WHERE id = $1`;
            const userProfileValues = [UserResult.rows[0].attachment_id];
            const userProfileResult = await client.query(userProfileQuery, userProfileValues);
            if (userProfileResult.rows.length !== 0) {
                result.rows[0].user.profile_image = baseUrl + userProfileResult.rows[0].file_url;
            }else{
                result.rows[0].user.profile_image = null;
            }
            delete result.rows[0].user.password;
            delete result.rows[0].user.user_id;
            delete result.rows[0].user.attachment_id;

            
        }
        const MembershipQuery = `SELECT * FROM memberships WHERE id = $1`;
        const MembershipValues = [result.rows[0].membership_id];
        const MembershipResult = await client.query(MembershipQuery, MembershipValues);  
        if (MembershipResult.rows.length !== 0) {
            result.rows[0].membership = MembershipResult.rows[0];
            delete result.rows[0].membership.id;
        }
        const PlanQuery = `SELECT * FROM membership_plans WHERE id = $1`;
        const PlanValues = [MembershipResult.rows[0].plan];
        const PlanResult = await client.query(PlanQuery, PlanValues);  
        if (PlanResult.rows.length !== 0) {
            result.rows[0].plan = PlanResult.rows[0];
            delete result.rows[0].plan.id;
        }
        delete result.rows[0].membership_id;
        delete result.rows[0].user_id;      

        return {
            success: true,
            message: "Purchased plan retrieved successfully.",
            data: result.rows[0]
        };
    } catch (error) {
        console.error("Error fetching purchased plan:", error);
        return {
            success: false,
            message: "Internal server error.",
            data: []
        };
    } finally {
        client.release();
    }
}
}

module.exports = PaymentModel;
