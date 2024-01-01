const cron = require('node-cron');
const TicketNotificationModel = require('../models/ticketNotification.model');
const EmailTransporter = require('../notifier/emailService');

cron.schedule(process.env.CRON_SCHEDULE, async () => { // RUNS EVERY specified interval set in ".env"
	const notifications = await TicketNotificationModel.find({ sentStatus: 'UN_SENT' });

	console.log(`Count of Unsent notification: ${notifications.length}`);

	if (notifications.length != 0) {
		for (let i = 0; i < notifications.length; i++) {
			const mailHtml = `<div>
                    <p>
                    <b>Dear '<i>${notifications[i].requester}</i>',</b>
                    </p>
                    <p>${notifications[i].content}</p>
                    You have registered successfully with CRM Service.
                    <br/>
                    <br/>
                    Thanks & Regards,
                    <p id="para1" style="margin-top: 5px; margin-bottom: 5px;"><strong>CRM Software</strong></p>
                    <br />
                    <p id="image1">
                            <img src="https://raw.githubusercontent.com/nil2022/notification_service/master/assets/1422292.jpg" width="300px" height="100%"/>   
                    </p>
                </div>`;

			notifications.forEach((notification) => {
				const mailData = {
					from: process.env.MAIL_FROM,
					reply_to: process.env.MAIL_REPLY_TO,
					to: notifications[i].receipientEmails,
					subject: notification.subject,
					// text: notification.content,
					html: mailHtml,
				};

				try {
					EmailTransporter.sendMail(mailData, async (err, info) => {
						if (err) {
							console.log('Mail Error:', err.name, err.message);
						} else {
							console.log('Email Sent Successfully: ', {
								Accepted: info.accepted,
								MessageID: info.messageId,
								Response: [info.response],
							});
							const savedNotification = await TicketNotificationModel.findOne({ _id: notification._id });

							savedNotification.sentStatus = 'SENT';

							await savedNotification.save();
						}
					});
				} catch (error) {
					console.log('Error:', error.message);
				}
			});
		}
	}
});
