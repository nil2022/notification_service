import nodemailer from 'nodemailer';

const mailSender = async (requesterEmailId, assignedToEmailId, bccMailId, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });

        let info = await transporter.sendMail({
            from: `CRM Software || Happy to Help 😊 <${process.env.MAIL_FROM}>`,
            replyTo: `CRM Support || Happy to Help 😊 <${process.env.MAIL_REPLY_TO}>`,
            to: `${requesterEmailId}`,
            cc: `${assignedToEmailId}`,
            bcc: bccMailId ? bccMailId : null,
            subject: `${title}`,
            html: `${body}`
        });
        console.log('Email Sent Successfully: ', {
            Accepted: info.accepted,
            MessageID: info.messageId,
            Response: [info.response]
        });
        return info;

    } 
    catch (error) {
        console.log('Mail Error:', error.name, error.message)
    }
};

export default mailSender;
