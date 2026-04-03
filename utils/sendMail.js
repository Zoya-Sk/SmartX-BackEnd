const nodemailer = require("nodemailer");

exports.sendMail = async(email,subject,body)=>{
    try {
        const transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        });

        const info = await transporter.sendMail({
            from:"SmartX",
            to:email,
            subject:subject,
            html:body,
        });

        return info;
    } catch (error) {
        console.log("Error occured while sending email",error);
    }
}