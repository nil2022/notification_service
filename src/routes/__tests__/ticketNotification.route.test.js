import request from 'supertest';
import express from 'express';
import router from '../ticketNotification.route.js';
import * as controller from '../../controllers/ticketNotification.controller.js';

jest.mock('../../controllers/ticketNotification.controller.js');
jest.mock('../../utils/pinoLogger.js');
jest.mock('../../configs/env.config.js', () => ({
	__esModule: true,
	default: { API_KEY: 'k'.repeat(32) }
}));

const API_KEY = 'k'.repeat(32);

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
				.set('x-api-key', API_KEY)
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
				.set('x-api-key', API_KEY)
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
				.get('/api/notifications')
				.set('x-api-key', API_KEY);

			expect(response.status).toBe(200);
			expect(controller.getAllNotifications).toHaveBeenCalled();
		});
	});

	describe('authentication', () => {
		it.each([
			['no key', undefined],
			['wrong key', 'wrong'],
			['key of different length', 'k'.repeat(40)]
		])('should return 401 with %s', async (_name, key) => {
			const req = request(app).get('/api/notifications');
			if (key) req.set('x-api-key', key);

			const response = await req;

			expect(response.status).toBe(401);
			expect(controller.getAllNotifications).not.toHaveBeenCalled();
		});
	});
});
