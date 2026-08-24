import request from 'supertest';
import express from 'express';
import router from '../ticketNotification.route.js';
import * as controller from '../../controllers/ticketNotification.controller.js';

jest.mock('../../controllers/ticketNotification.controller.js');
jest.mock('../../utils/pinoLogger.js');
jest.mock('../../configs/env.config.js', () => ({
	default: {}
}));

describe('Ticket Notification Routes', () => {
	let app;

	beforeEach(() => {
		app = express();
		app.use(express.json());
		app.use('/api', router);
		jest.clearAllMocks();
	});

	describe('POST /api/create-notification', () => {
		it('should call acceptNotificationRequest controller', async () => {
			controller.acceptNotificationRequest.mockImplementation((req, res) => {
				res.status(200).json({ success: true });
			});

			const payload = {
				subject: 'Test',
				content: 'Content',
				ticketId: 'TICKET-001',
				requesterEmailIds: 'user@example.com',
				assignedToEmailIds: 'admin@example.com'
			};

			const response = await request(app)
				.post('/api/create-notification')
				.send(payload);

			expect(response.status).toBe(200);
			expect(controller.acceptNotificationRequest).toHaveBeenCalled();
		});
	});

	describe('GET /api/fetch-notification', () => {
		it('should call getNotificationById controller', async () => {
			controller.getNotificationById.mockImplementation((req, res) => {
				res.status(200).json({ success: true });
			});

			const response = await request(app)
				.get('/api/fetch-notification')
				.query({ id: 'TICKET-001' });

			expect(response.status).toBe(200);
			expect(controller.getNotificationById).toHaveBeenCalled();
		});
	});

	describe('GET /api/notifications', () => {
		it('should call getAllNotifications controller', async () => {
			controller.getAllNotifications.mockImplementation((req, res) => {
				res.status(200).json({ success: true, data: [] });
			});

			const response = await request(app)
				.get('/api/notifications');

			expect(response.status).toBe(200);
			expect(controller.getAllNotifications).toHaveBeenCalled();
		});
	});
});
