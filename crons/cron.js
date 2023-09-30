const cron = require('node-cron')
const TicketNotificationModel = require("../models/ticketNotification.model")
const EmailTransporter = require("../notifier/emailService")


cron.schedule(process.env.CRON_SCHEDULE, async () => {   //RUNS EVERY specified interval set in ".env"
    
    const notifications = await TicketNotificationModel.find({
        sentStatus: "UN_SENT"
    })

    console.log(`Count of unsent notification: ${notifications.length}`)

    let mailHtml = `
            <div>
            <h5> Hello ${notifications.userId}, </h5>
            <br/>
            You have registered successfully with email <b>  </b>   
            <br/>
            Your userId required at the time of login will be  <b>  </b>
            <br/>
            <hr/>
        Thanks & Regards, 
        <h3> Book My Show </h3>  <br/>
            <img src="https://logodix.com/logo/2011124.jpg"/>
            </div>
            `
    notifications.forEach(notification => {
        const mailData = {
            from: process.env.MAIL_FROM,
            reply_to: process.env.MAIL_REPLY_TO,
            to: process.env.MAIL_TO,
            subject: notification.subject,
            text: notification.content,
            html: mailHtml
        }
        console.log({
            FROM:mailData.from,
            TO:mailData.to
        })

        EmailTransporter.sendMail(mailData, async (err, info) => {
            if (err) {
                console.log("Mail Error:", err.name, err.message)
            } else {
                console.log("Email Sent Successfully: ", {
                    Accepted:info.accepted,
                    MessageID:info.messageId,
                    Response:[info.response]
                });
                const savedNotification = await TicketNotificationModel
                    .findOne({ _id: notification._id })
                savedNotification.sentStatus = "SENT"
                await savedNotification.save()
            }
        })
    })
})