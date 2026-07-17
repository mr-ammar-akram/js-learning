const NotificationService = require('../emails/notificationService');
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
}

module.exports = NotificationController;
