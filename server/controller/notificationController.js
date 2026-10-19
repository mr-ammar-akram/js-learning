const NotificationService = require('../emails/notificationService');
const NotificationModel = require('../models/NotificationModel');
const OtpModel = require('../models/otpModel');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
class NotificationController {
    static async  emailVerify (user_mail, user_name, user_id) {
        try{
            // 2. Locate and read the HTML template file 
            const templatePath = path.join(__dirname, '../emails/templates/emailVerify.html');
            const sourceHtml = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(sourceHtml);
            const OTP = Math.floor(100000 + Math.random() * 900000);
            if(!user_mail) {
                return {
                    success: false,
                    status_code: 400,
                    status: 'bad_request',
                    message: 'Email is required'
                };
            }
            const dynamicData = {
                userName: user_name,
                otp: OTP,
            };
            // Add your inline image attachment here
            const emailBody = compiledTemplate(dynamicData);
            const fromEmail = `"Site Name" <${process.env.EMAIL_USER}>`;
            const subject = "Email Verification";
            const toEmail = user_mail;
            
            const response = await NotificationService.sendNotification(fromEmail, toEmail, subject, emailBody);
            if(!response.success){
                return {
                    success: false,
                    message: response.message,
                };
            }
            const otp = await OtpModel.storeOTP(user_id, OTP);
            if(otp.success){
                return {
                    success: true,
                    message: 'Email sent successfully',
                    data: otp.data
                };
            }
        } catch(error) {
            return {
                status_code: 500,
                status: 'internal_server_error',
                message: error.message
            };
        }
    }

    static async registerByAdminMail(user_mail, user_name, user_id, user_password, user_role) {
        try{
            // 2. Locate and read the HTML template file 
            const templatePath = path.join(__dirname, '../emails/templates/registerMail.html');
            const sourceHtml = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(sourceHtml);
            if(!user_mail) {
                return {
                    success: false,
                    status_code: 400,
                    status: 'bad_request',
                    message: 'Email is required'
                };
            }
            let login_url = 'http://localhost:3000/login';
            if(user_role === "admin"){
                login_url = 'http://localhost:3000/ds-admin/login';
            }
            const dynamicData = {
                userName: user_name,
                userEmail: user_mail,
                userPassword: user_password,
                login_url: login_url
            };
            // Add your inline image attachment here
            const emailBody = compiledTemplate(dynamicData);
            const fromEmail = `"Site Name" <${process.env.EMAIL_USER}>`;
            const subject = "Registration Confirmation";
            const toEmail = user_mail;
            
            const response = await NotificationService.sendNotification(fromEmail, toEmail, subject, emailBody);
            if(!response.success){
                return {
                    success: false,
                    message: response.message,
                };
            }
            return {
                success: true,
                message: 'Email sent successfully',
            };
        }catch(err){
            return {
                success: false,
                status_code: 500,
                status: 'internal_server_error',
                message: err.message
            };
        }

    }

    static async addNotification(notification) {
        try{
            // 2. Locate and read the HTML template file 
            const templatePath = path.join(__dirname, '../emails/templates/newFollower.html');
            const sourceHtml = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(sourceHtml);
            const dynamicData = {
                userName: notification.authorName,
                followerName: notification.follower,
                blogTitle: notification.blog
            };
            const emailBody = compiledTemplate(dynamicData);
            const fromEmail = `"Knowledge Arrea" <${process.env.EMAIL_USER}>`;
            const subject = `${notification.follower} started following you`;
            const toEmail = notification.author;
            const response = await NotificationService.sendNotification(fromEmail, toEmail, subject, emailBody);
            if(!response.success){
                return {
                    success: false,
                    message: response.message,
                };
            }
            return {
                success: true,
                message: 'Email sent successfully',
            };
        }catch(err){
            return {
                success: false,
                status_code: 500,
                status: 'internal_server_error',
                message: err.message
            };
        }
    }

    // ===========================================
    // Send Messaage
    // ===========================================


    // =========================================
    // GET NOTIFICATIONS
    // =========================================

    static async getNotifications(req, res) {

        try {

            const userId =
                req.admin.id;

            const notifications =
                await NotificationModel.getByUserId(
                    userId
                );

            return res.status(200).json({
                success: true,
                data: notifications
            });

        } catch (error) { 

            console.error(
                "Get notifications error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to get notifications"
            });

        }

    }

    // =========================================
    // MARK ONE AS READ
    // =========================================

    static async markAsRead(req, res) {
        console.log("req.params",req.params.id);
        console.log("req.admin.id",req.admin.id);
        try {

            const userId =
                req.admin.id;

            const notificationId =
                parseInt(req.params.id);

            const notification =
                await NotificationModel.markAsRead(
                    notificationId,
                    userId
                );

            if (!notification) {

                return res.status(404).json({
                    success: false,
                    message: "Notification not found"
                });

            }

            return res.status(200).json({
                success: true,
                data: notification
            });

        } catch (error) {

            console.error(
                "Mark notification error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to update notification"
            });

        }

    }


    // =========================================
    // MARK ALL AS READ
    // =========================================

    static async markAllAsRead(req, res) {

        try {

            const userId =
                req.admin.id;

            await NotificationModel.markAllAsRead(
                userId
            );

            return res.status(200).json({
                success: true,
                message: "All notifications marked as read"
            });

        } catch (error) {

            console.error(
                "Mark all notifications error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to update notifications"
            });

        }

    }


    static async markAllMessagesAsRead(req, res) {

        try {

            const userId = req.admin.id;

            await NotificationModel.markAllMessagesAsRead(userId);

            return res.status(200).json({
                success: true,
                message: "All messages marked as read"
            });

        } catch (error) {
            console.error(
                "Mark all messages error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to update messages"
            });
        }
    }


    // =========================================
    // TEST NOTIFICATION
    // =========================================

    static async createTestNotification(
        req,
        res
    ) {

        try {

            const receiverId =
                req.admin.id;

            const io =
                req.app.get("io");


            const notification =
                await NotificationModel.create({

                    user_id: receiverId,

                    sender_id: null,

                    type: "test",

                    message:
                        "This is a test notification.",

                    post_id: null

                });


            // Send real-time notification
            io.to(
                `user_${receiverId}`
            ).emit(
                "new_notification",
                notification
            );


            return res.status(201).json({
                success: true,
                data: notification
            });

        } catch (error) {

            console.error(
                "Create test notification error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to create notification"
            });

        }

    }

}

module.exports = NotificationController;
