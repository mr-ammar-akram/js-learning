const express = require("express");
const PaymentModel = require('../models/paymentModel');
const router = express.Router();
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/payments/charge
 *
 * Body: {
 *   stripeToken: string,     // tok_xxx from stripe.createToken() on the client
 *   membership_id: string,
 *   membership_name: string,
 *   plan_name: string,
 *   plan_amount: number,     // dollars, e.g. 49.99
 * }
 *
 * SECURITY NOTE: this trusts plan_amount from the request body, which is fine
 * for wiring things up in test mode, but before going live you should look up
 * the real price server-side from membership_id/plan_name (e.g. from your DB)
 * instead of trusting whatever the client sends — otherwise a user could
 * tamper with the request and pay any amount they choose.
 */
class PaymentService {
    static async charge(req, res) {
    const { stripeToken, plan_amount, membership_name, userId, membership_id, plan_name } = req.body;

    if (!stripeToken) {
        return res.status(400).json({ error: "Missing payment token." });
    }

    const amount = Number(plan_amount);

    if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid plan amount." });
    }

    try {
        const charge = await stripe.charges.create({
            amount: Math.round(amount * 100), // Stripe expects the smallest currency unit (cents)
            currency: "usd",
            source: stripeToken,
            description: `${membership_name || "Membership"} - ${plan_name || "Plan"}`,
        });
        if(!charge){
            res.status(400).json({
                success: false,
                message: "Payment failed.",
                data: []
            });
        }
        const paymentData = {
            stripe_payment_id: charge.id,
            user_id: userId,
            membership_id: membership_id,
            plan_name: plan_name,
            amount: amount,
        };
        const result = await PaymentModel.addPayment(paymentData);
        if(!result.success){
            res.status(400).json({
                success: false,
                message: result.message,
                data: []
            });
        }
        return res.json({
            success: true,
            chargeId: charge.id,
            status: charge.status,
            data: result.data.id
        });
    } catch (err) {
        // Stripe throws a typed error (e.g. StripeCardError) with a
        // customer-safe message on card declines, so it's fine to
        // forward err.message here.
        console.error("Stripe charge error:", err);

        return res.status(402).json({
            error: err.message || "Payment failed. Please try again.",
        });
    }
}

static async getPaymentById(req, res) {

    try {
        const payment = await PaymentModel.getPaymentById(req.params.id);

        if (!payment) {
            return res.status(404).json({ 
                success: false,
                message: "Payment not found.",
                data: []
            });
        }

        return res.json({   
            success: true,
            data: payment.data
        });
    } catch (err) {
        console.error("Get payment error:", err);
        return res.status(500).json({ 
            success: false,
            message: "Failed to retrieve payment details.",
            data: []
        });
    }
}

}

module.exports = PaymentService;

