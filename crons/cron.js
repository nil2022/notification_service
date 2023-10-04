const cron = require('node-cron')
const TicketNotificationModel = require("../models/ticketNotification.model")
const EmailTransporter = require("../notifier/emailService")


cron.schedule(process.env.CRON_SCHEDULE, async () => {   //RUNS EVERY specified interval set in ".env"
    
    const notifications = await TicketNotificationModel.find({ sentStatus: "UN_SENT" })
            
            console.log(`Count of Unsent notification: ${notifications.length}`)
            
            if(notifications.length!=0){
                for(let i=0;i<notifications.length;i++){

                    let mailHtml = `<div>
                    <p>
                    <b>Hello '<i>${notifications[i].requester}</i>',</b>
                    </p>
                    <p>Content is - ${notifications[i].content}</p>
                    You have registered successfully with CRM Service
                    <br/>
                    Thanks & Regards,
                    <p id="para1" style="margin-top: 5px; margin-bottom: 5px;"><strong>Book My Show</strong></p>
                    <br />
                    <p id="image1">
                    <a href="https://in.bookmyshow.com/" target="_blank"> 
                        <img src="https://logodix.com/logo/2011124.jpg" width="150px" height="100%"/>
                    </a>
                    </p>
                </div>`
    
                        notifications.forEach(notification => {
                            const mailData = {
                                from: process.env.MAIL_FROM,
                                reply_to: process.env.MAIL_REPLY_TO,
                                to: notifications[i].receipientEmails,
                                subject: notification.subject,
                                // text: notification.content,
                                html: mailHtml
                            }

                            try {
                                EmailTransporter.sendMail(mailData, async (err, info) => {
                                    if (err) {
                                        console.log("Mail Error:", err.name, err.message)
                                    } else {
                                        console.log("Email Sent Successfully: ", {
                                            Accepted:info.accepted,
                                            MessageID:info.messageId,
                                            Response:[info.response]
                                        });
                                        const savedNotification = await TicketNotificationModel.findOne({ _id: notification._id })
    
                                        savedNotification.sentStatus = "SENT"
    
                                        await savedNotification.save()
                                    }
                                })
                            } catch (error) {
                                console.log('Error:', error.message);
                            }
                            
                            
                    })  
                }
            }
            
})