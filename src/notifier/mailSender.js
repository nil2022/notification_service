import nodemailer from 'nodemailer';
import logger from '../utils/pinoLogger.js';
import env from '../configs/env.config.js';

const mailSender = async (requesterEmailId, assignedToEmailId, bccMailId, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: env.MAIL_HOST,
            port: env.MAIL_PORT,
            secure: false,
            auth: {
                user: env.MAIL_USERNAME,
                pass: env.MAIL_PASSWORD
            }
        });

        let info = await transporter.sendMail({
            from: `CRM Software || Happy to Help 😊 <${env.MAIL_FROM}>`,
            replyTo: `CRM Support || Happy to Help 😊 <${env.MAIL_REPLY_TO}>`,
            to: `${requesterEmailId}`,
            cc: `${assignedToEmailId}`,
            bcc: bccMailId ? bccMailId : null,
            subject: `${title}`,
            html: `${body}`
        });
        logger.info({
            Accepted: info.accepted,
            MessageID: info.messageId,
            Response: [info.response]
        }, 'Email Sent Successfully: ' )
        
        return info;

    } 
    catch (error) {
        logger.error(error, 'Email Sent Failed: ' )
        throw error;
    }
};

export default mailSender;
