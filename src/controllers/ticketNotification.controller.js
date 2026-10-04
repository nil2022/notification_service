import { TicketNotification } from '../models/ticketNotification.model.js';
import logger from '../utils/pinoLogger.js';

const MAX_EMAILS_PER_FIELD = 10;
const MAX_PAGE_SIZE = 100;
const SIMPLE_EMAIL = /^[^\s@<>",;]+@[^\s@<>",;]+\.[^\s@<>",;]+$/;

const FIELD_LIMITS = {
    subject: 200,
    content: 5000,
    requester: 100,
    assignedTo: 100,
    ticketId: 100
};

const isNonEmptyString = (value, max) =>
    typeof value === 'string' && value.trim().length > 0 && value.length <= max;

// Accepts a single address or a comma-separated list; rejects CR/LF and anything not a plain address
const isValidEmailList = (value) => {
    if (typeof value !== 'string' || value.length > 2000) return false;
    const emails = value.split(',').map((email) => email.trim());
    return (
        emails.length <= MAX_EMAILS_PER_FIELD &&
        emails.every((email) => SIMPLE_EMAIL.test(email))
    );
};

const sendBadRequest = (res, message) =>
    res.status(400).json({
        data: '',
        message,
        statusCode: 400,
        success: false
    });

/**
 *  * This controller adds a new unsent notification to our db
 */
export const acceptNotificationRequest = async (req, res) => {
    const body = req.body ?? {};

    const requiredStrings = ['subject', 'content', 'ticketId'];
    const optionalStrings = ['requester', 'assignedTo'];

    for (const field of requiredStrings) {
        if (!isNonEmptyString(body[field], FIELD_LIMITS[field])) {
            return sendBadRequest(res, `Invalid or missing field: ${field}`);
        }
    }
    for (const field of optionalStrings) {
        if (
            body[field] !== undefined &&
            !isNonEmptyString(body[field], FIELD_LIMITS[field])
        ) {
            return sendBadRequest(res, `Invalid field: ${field}`);
        }
    }
    for (const field of ['requesterEmailIds', 'assignedToEmailIds']) {
        if (!isValidEmailList(body[field])) {
            return sendBadRequest(res, `Invalid or missing field: ${field}`);
        }
    }

    // Explicit whitelist so clients can never set sentStatus or other internal fields
    const notificationObject = {
        subject: body.subject,
        content: body.content,
        requesterEmailIds: body.requesterEmailIds,
        assignedToEmailIds: body.assignedToEmailIds,
        requester: body.requester,
        assignedTo: body.assignedTo,
        ticketId: body.ticketId
    };
    try {
        const notification =
            await TicketNotification.create(notificationObject);

        logger.info(
            { ticketId: notification.ticketId },
            'Notification created'
        );

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

    // Reject arrays/objects (e.g. ?id=a&id=b) so the value can't act as a query operator
    if (!isNonEmptyString(reqId, FIELD_LIMITS.ticketId)) {
        return sendBadRequest(res, 'Invalid or missing query param: id');
    }

    try {
        const notification = await TicketNotification.findOne({
            ticketId: reqId
        });

        if (!notification) {
            return res.status(404).json({
                data: '',
                message: 'Notification not found',
                statusCode: 404,
                success: false
            });
        }

        logger.info({ ticketId: reqId }, 'Notification fetched by Id');

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
 * * This controller fetches notifications (paginated, newest first)
 */
export const getAllNotifications = async (req, res) => {
    const limit = Math.min(
        Math.max(parseInt(req.query?.limit, 10) || 50, 1),
        MAX_PAGE_SIZE
    );
    const page = Math.max(parseInt(req.query?.page, 10) || 1, 1);

    try {
        const notificationsData = await TicketNotification.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        logger.info(`Notifications fetched: ${notificationsData.length}`);

        res.status(200).json({
            data: notificationsData,
            message: 'Notifications fetched successfully',
            page,
            limit,
            statusCode: 200,
            success: true
        });
    } catch (err) {
        logger.error(err, 'Error while fetching notifications ::');

        res.status(500).json({
            data: '',
            message: 'Internal Server Error!',
            statusCode: 500,
            success: false
        });
    }
};
