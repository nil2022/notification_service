const cron = require('node-cron')
const ticketNotificationModel = require('../models/ticketNotification.model')
const TicketNotificationModel = require("../models/ticketNotification.model")
const EmailTransporter = require("../notifier/emailService")


cron.schedule('*/1 * * * *', async () => {   //RUNS EVERY 1 minute
    
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
        Thanks & Regards 
        <h3> Book My Show </h3>  <br/>
            <img src="https://logodix.com/logo/2011124.jpg"/>
            </div>
            `
    notifications.forEach(notification => {
        const mailData = {
            from: '"Nilanjan Haldar" nil.haldar@gmail.com',
            replyTo: '"Nilanjan Haldar" nil.haldar@gmail.com',
            to: notification.receipientEmails,
            subject: notification.subject,
            text: notification.content,
            html: mailHtml
        }
        console.log(mailData)

        EmailTransporter.sendMail(mailData, async (err, info) => {
            if (err) {
                console.log(err.message)
            } else {
                console.log("Email Sent Successfully " + info.response);
                const savedNotification = await TicketNotificationModel
                    .findOne({ _id: notification._id })
                savedNotification.sentStatus = "SENT"
                await savedNotification.save()
            }
        })
    })
})