const mailService = require('../services/mailService');

const sendEmail = async (req, res) => {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const response = await mailService.sendMail(to, subject, text);
    return res.status(response.success ? 200 : 500).json(response);
};

module.exports = { sendEmail };