const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    console.log("hello iam mail sender")
    console.log(process.env.MAIL_HOST)
    console.log(process.env.MAIL_USER)
    console.log(process.env.MAIL_PASS)
    try{
            let transporter = nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            })


            let info = await transporter.sendMail({
                from: 'StudyByte ||  by Sameer khan',
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            console.log(info);
            return info;
    }
    catch(error) {
        console.log(error.message);
        console.log("hiii")
    }
}


module.exports = mailSender;