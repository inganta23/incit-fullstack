const config = require("../config");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken")

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'announcetes@gmail.com',
        pass: 'nlvoiummjfiympxg',
    },
});

function sendVerificationEmail(data) {
    const token = jwt.sign(data, config.secret, { expiresIn: '1d' });
    const verificationLink = `http://localhost:5000/auth/verify-email/${token}`;

    const mailOptions = {
        from: 'announcetes@gmail.com',
        to: data.email,
        subject: 'Email Verification',
        text: `Please click on the following link to verify your email: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = { sendVerificationEmail }