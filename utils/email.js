const nodemailer = require("nodemailer")
exports.sendEmail = ({ sendTo, sub, msg, htmlMsg }) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    transporter.sendMail({
        to: sendTo,
        from: process.env.EMAIL,
        subject: sub,
        text: msg,
        html: htmlMsg
    }, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("email send successfully");
        }
    })
}