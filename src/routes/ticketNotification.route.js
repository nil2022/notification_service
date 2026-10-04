import { Router } from 'express';
import { apiKeyAuth } from '../middlewares/apiKeyAuth.js';
import { acceptNotificationRequest, getAllNotifications, getNotificationById } from '../controllers/ticketNotification.controller.js';

const router = Router();

/** Every notification route requires the shared API key */
router.use(apiKeyAuth);

/** This route adds a notification to corresponding ticket created */
router.post('/create-notification', acceptNotificationRequest);

/** This route informs the client about the current status of a notification */
router.get('/fetch-notification', getNotificationById);

/** This route fetches all notifications */
router.get('/notifications', getAllNotifications)

export default router;
