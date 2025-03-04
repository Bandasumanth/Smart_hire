const transporter = require('../config/mailConfig');

const sendMail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, message: `Email sent` };
    } catch (error) {
        console.log(error)
        return { success: false, message: error.message };
    }
};

module.exports = { sendMail };