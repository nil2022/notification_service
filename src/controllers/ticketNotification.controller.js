import { TicketNotification } from '../models/ticketNotification.model.js';
import logger from '../utils/pinoLogger.js';

/**
 *  * This controller adds a new unsent notification to our db
 */
export const acceptNotificationRequest = async (req, res) => {
    const notificationObject = {
        subject: req.body.subject,
        content: req.body.content,
        requesterEmailIds: req.body.requesterEmailIds,
        assignedToEmailIds: req.body.assignedToEmailIds,
        requester: req.body.requester,
        assignedTo: req.body.assignedTo,
        ticketId: req.body.ticketId
    };
    try {
        const notification =
            await TicketNotification.create(notificationObject);

        logger.info('Notification created: ', notification);

        res.status(200).json({
            data: {
                requestId: notification.ticketId
            },
            status: 'Request Accepted from CRM application',
            statusCode: 200,
            success: true
        });
    } catch (err) {
        logger.error(err, 'Error while accepting a notification request: ');

        res.status(500).json({
            data: '',
            message: 'Internal Server Error!',
            statusCode: 500,
            success: false
        });
    }
};

/**
 * * This controller informs the client about the current status of a
 * notification.
 */
export const getNotificationById = async (req, res) => {
    const reqId = req.query.id;

    try {
        const notification = await TicketNotification.findOne({
            ticketId: reqId
        });

        logger.info('Notification fetched by Id: ', notification);

        res.status(200).json({
            data: {
                requestId: notification.ticketId,
                subject: notification.subject,
                content: notification.content,
                receipientEmails: notification.receipientEmails,
                sentStatus: notification.sentStatus
            },
            status: 'Notification Status fetched Successfully',
            statusCode: 200,
            success: true
        });
    } catch (err) {
        logger.error(err, 'Error while fetching a notification request: ');

        res.status(500).json({
            data: '',
            message: 'Internal Server Error!',
            statusCode: 500,
            success: false
        });
    }
};

/**
 * * This controller fetches all notifications
 */
export const getAllNotifications = async(req, res) => {
    try {
        const notificationsData = await TicketNotification.find();

        logger.info('All Notifications fetched: ', notificationsData);

        res.status(200).json({
            data: notificationsData,
            message: 'Notifications fetched successfully',
            statusCode: 200,
            success: true
        })
    } catch (err) {
        logger.error(err, 'Error while fetching notifications ::');
        
        res.status(500).json({
            data: '',
            message: 'Internal Server Error!',
            statusCode: 500,
            success: false
        });
    }
}
