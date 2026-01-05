const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "ITT_A_TE_MAILTRAP_USERED", // Mailtrap-ből
        pass: "ITT_A_TE_MAILTRAP_JELSZAVAD"  // Mailtrap-ből
    }
});

module.exports = transporter;