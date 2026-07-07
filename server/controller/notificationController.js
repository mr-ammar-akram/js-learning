const NotificationService = require('../emails/notificationService');
const UserModel = require('../models/userModel');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
class NotificationController {
    static async  emailVerify (user_mail, user_name) {
        try{
            // 2. Locate and read the HTML template file 
            const templatePath = path.join(__dirname, '../emails/templates/emailVerify.html');
            const sourceHtml = fs.readFileSync(templatePath, 'utf8');
            const compiledTemplate = handlebars.compile(sourceHtml);
            const OTP = Math.floor(100000 + Math.random() * 900000);
            if(!user_mail) {
                return {
                    status_code: 400,
                    status: 'bad_request',
                    message: 'Email is required'
                };
            }

            const dynamicData = {
                userName: user_name,
                otp: OTP,
            };

            const emailBody = compiledTemplate(dynamicData);
            const fromEmail = `"Site Name" <${process.env.EMAIL_USER}>`;
            const subject = "Email Verification";
            const toEmail = user_mail;

            const response = await NotificationService.sendNotification(fromEmail, toEmail, subject, emailBody);
            if(response.code){
                return {
                    status_code: 400,
                    status: 'error',
                    message: response.message,
                    data: []
                };
            }
            // Response of success message with data
            return {
                status_code: 200,
                status: 'success',
                message: 'Email sent successfully',
                data: response
            };
        }catch(error){
            return {
                status_code: 500,
                status: 'internal_server_error',
                message: error.message
            };
        }
    }
}

module.exports = NotificationController;
