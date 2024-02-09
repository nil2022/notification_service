const cron = require('node-cron');
const TicketNotificationModel = require('../models/ticketNotification.model');
const EmailTransporter = require('../notifier/emailService');

cron.schedule(process.env.CRON_SCHEDULE, async () => { // RUNS EVERY specified interval set in ".env"
	const notifications = await TicketNotificationModel.find({ sentStatus: 'UN_SENT' });

	console.log(`Count of Unsent notification: ${notifications.length}`);

	if (notifications.length != 0) {
		for (let i = 0; i < notifications.length; i++) {
						const mailHtml = `<div style="border: 3px solid black; border-radius: 5px; padding: 10px; margin: 10px; max-width: fit-content;">
						<p>
						<b>Dear <h2>${notifications[i].requester}</h2></b>
						<br/>
						You have registered successfully with CRM Service.
						</p>
						<p>Here is your ticket details:<br/><h3>${notifications[i].content}</h3></p>
						Your ticket is assigned to <h3>${notifications[i].assignedTo}</h3>
						<hr>Thank you for using our service ! 😊
						<h2>CRM Software 🤝</h2>
					</div>`;

			notifications.forEach((notification) => {
				const mailData = {
					from: process.env.MAIL_FROM,
					replyTo: process.env.MAIL_REPLY_TO,
					to: notifications[i].requesterEmailIds,
					cc: notifications[i].assignedToEmailIds,
					bcc: 'pZDnN@example.com',
					subject: notification.subject,
					// text: 'Mail Text',
					html: mailHtml,
					// attachments: [{
					// 	filename: '1422292.jpg',
					// 	path: './src/assets/1422292.jpg',
					// 	cid: '1422292'
					// }],
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

							await savedNotification.save({ validateBeforeSave: false });
						}
					});
				} catch (error) {
					console.log('Error:', error.message);
				}
			});
		}
	}
});
