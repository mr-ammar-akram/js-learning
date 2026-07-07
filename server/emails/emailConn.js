const mailer = require('nodemailer');
require("dotenv").config();

const transporter = mailer.createTransport({
    host: 'smtp.gmail.com',
    port: '587',
    secure: false, // false for 587
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});
module.exports = transporter;