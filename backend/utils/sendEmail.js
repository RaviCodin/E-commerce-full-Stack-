
const nodeMailer = require('nodemailer');

const sendEmail = async (options)=>{
    const transporter = nodeMailer.createTransport({
        host:process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        service:process.env.SMVT_SERVISE,
        auth:{
            user:process.env.SMVT_MAIL,
            pass:process.env.SMVT_PASS
        }
    })
    
    const mailOptions = {
        from: process.env.SMVT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.massage
    }
    
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;