import cron from 'node-cron';
import { TicketNotification } from '../models/ticketNotification.model.js';
import mailSender from '../notifier/mailSender.js';
import { ticketSentStatus } from '../utils/constants.js';
import { ticketCreated } from '../mail/templates/ticketCreated.js';
import logger from '../utils/pinoLogger.js';
import env from '../configs/env.config.js';

/**
 * * This is a cron job that runs every specified interval
 */
cron.schedule(env.CRON_SCHEDULE, async () => {
	try {
		// RUNS EVERY specified interval set in ".env"
		const notifications = await TicketNotification.find({
			sentStatus: ticketSentStatus.un_sent
		});

		logger.info(`Count of Unsent notification: ${notifications.length}`);

		// One mail per notification (previously nested loop sent each mail N times)
		await Promise.allSettled(
			notifications.map(async (notification) => {
				try {
					const response = await mailSender(
						notification.requesterEmailIds,
						notification.assignedToEmailIds,
						null,
						notification.subject,
						ticketCreated(notification)
					);
					logger.debug(response);

					await TicketNotification.findOneAndUpdate(
						{ _id: notification._id },
						{ sentStatus: ticketSentStatus.sent }
					);
					logger.info(
						{ ticketId: notification.ticketId },
						'Ticket notification sent'
					);
				} catch (error) {
					logger.error(error, 'Got Error ::');
				}
			})
		);
	} catch (error) {
		logger.error(error, 'Notification cron failed ::');
	}
});
