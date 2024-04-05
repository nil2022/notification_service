import cron from 'node-cron';
import { TicketNotification } from '../models/ticketNotification.model.js';
import mailSender from '../notifier/mailSender.js';
import { ticketSentStatus } from '../utils/constants.js';
import { ticketCreated } from '../mail/templates/ticketCreated.js';

/**
 * * This is a cron job that runs every specified interval
 */
cron.schedule(process.env.CRON_SCHEDULE, async () => {
    // RUNS EVERY specified interval set in ".env"
    const notifications = await TicketNotification.find({
        sentStatus: ticketSentStatus.un_sent
    });

    console.log(`Count of Unsent notification: ${notifications.length}`);

    if (notifications.length != 0) {
        for (let i = 0; i < notifications.length; i++) {
            notifications.map(async (notification) => {
                try {
                    await mailSender(
                        notification.requesterEmailIds,
                        notification.assignedToEmailIds,
                        null,
                        notification.subject,
                        ticketCreated(notification)
                    );
					const savedNotification = await TicketNotification.findOneAndUpdate(
						{ _id: notification._id }, 
						{
							sentStatus: ticketSentStatus.sent
						},
						{ new: true }
					)
					console.log('Ticket Created! :: ', savedNotification);

                } 
				catch (error) {
                    console.log('Got Error:', error);
                }
            });
        }
    }
});
