const transporter = require('./emailConn');

class NotificationService {
    
    static async sendNotification(from, to, subject, message){
        try{
            // Create Email
            const mailOptions = {
            from: from,
            to: to, 
            subject: subject,
            html: message,
        };
        // Send Email
        const info = await transporter.sendMail(mailOptions);
        return {
            success: true,
            messageID: info.messageId
        }
        }catch(error){
            return {
                success: false,
                message: error.message
            }
        }
    }
}

module.exports = NotificationService;

