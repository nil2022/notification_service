import { acceptNotificationRequest, getNotificationById, getAllNotifications } from '../ticketNotification.controller.js';
import { TicketNotification } from '../../models/ticketNotification.model.js';

jest.mock('../../models/ticketNotification.model.js');
jest.mock('../../configs/env.config.js', () => ({
	default: {}
}));
jest.mock('../../utils/pinoLogger.js', () => ({
	__esModule: true,
	default: {
		info: jest.fn(() => {}),
		error: jest.fn(() => {}),
		debug: jest.fn(() => {}),
		warn: jest.fn(() => {})
	}
}));

describe('Ticket Notification Controller - Integration Tests', () => {
	describe('acceptNotificationRequest', () => {
		it('should create and persist notification to database', async () => {
			const mockNotification = {
				_id: '123',
				subject: 'Ticket Update',
				content: 'Your ticket has been updated',
				ticketId: 'TKT-456',
				requesterEmailIds: 'requester@example.com',
				assignedToEmailIds: 'assignee@example.com',
				requester: 'John',
				assignedTo: 'Jane'
			};

			TicketNotification.create.mockResolvedValue(mockNotification);

			const req = { body: mockNotification };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn()
			};

			await acceptNotificationRequest(req, res);

			expect(TicketNotification.create).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
		});

		it('should return error response on database failure', async () => {
			TicketNotification.create.mockRejectedValue(new Error('DB Connection failed'));

			const req = {
				body: {
					subject: 'Test',
					content: 'Test Content',
					ticketId: 'TKT-789',
					requesterEmailIds: 'user@example.com',
					assignedToEmailIds: 'admin@example.com'
				}
			};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn()
			};

			await acceptNotificationRequest(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
		});
	});

	describe('getNotificationById', () => {
		it('should retrieve notification by ticket ID', async () => {
			const mockNotif = {
				ticketId: 'TKT-001',
				subject: 'Test',
				content: 'Test content',
				sentStatus: 'SENT'
			};

			TicketNotification.findOne.mockResolvedValue(mockNotif);

			const req = { query: { id: 'TKT-001' } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn()
			};

			await getNotificationById(req, res);

			expect(TicketNotification.findOne).toHaveBeenCalledWith({ ticketId: 'TKT-001' });
			expect(res.status).toHaveBeenCalledWith(200);
		});

		it('should handle notification not found', async () => {
			TicketNotification.findOne.mockRejectedValue(new Error('Not found'));

			const req = { query: { id: 'TKT-999' } };
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn()
			};

			await getNotificationById(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
		});
	});

	describe('getAllNotifications', () => {
		it('should fetch all notifications from database', async () => {
			const mockNotifications = [
				{ _id: '1', ticketId: 'TKT-001', subject: 'Alert 1' },
				{ _id: '2', ticketId: 'TKT-002', subject: 'Alert 2' }
			];

			TicketNotification.find.mockResolvedValue(mockNotifications);

			const req = {};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn()
			};

			await getAllNotifications(req, res);

			expect(TicketNotification.find).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
		});

		it('should handle database errors gracefully', async () => {
			TicketNotification.find.mockRejectedValue(new Error('Database error'));

			const req = {};
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn()
			};

			await getAllNotifications(req, res);

			expect(res.status).toHaveBeenCalledWith(500);
		});
	});
});

