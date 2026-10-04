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

// Mimics mongoose's chainable query: find().sort().skip().limit() -> awaitable
const mockQuery = (result) => {
	const query = Promise.resolve(result);
	query.catch(() => {});
	query.sort = jest.fn().mockReturnValue(query);
	query.skip = jest.fn().mockReturnValue(query);
	query.limit = jest.fn().mockReturnValue(query);
	return query;
};

const mockRes = () => ({
	status: jest.fn().mockReturnThis(),
	json: jest.fn()
});

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

	describe('acceptNotificationRequest validation', () => {
		const valid = {
			subject: 'Subj',
			content: 'Body',
			ticketId: 'TKT-1',
			requesterEmailIds: 'a@example.com',
			assignedToEmailIds: 'b@example.com, c@example.com'
		};

		it.each([
			['missing body', undefined],
			['object subject', { ...valid, subject: { $gt: '' } }],
			['oversized content', { ...valid, content: 'x'.repeat(5001) }],
			['invalid email', { ...valid, requesterEmailIds: 'not-an-email' }],
			['email header injection', { ...valid, requesterEmailIds: 'a@example.com\r\nBcc: evil@example.com' }],
			['too many recipients', { ...valid, assignedToEmailIds: Array(11).fill('a@example.com').join(',') }]
		])('should return 400 for %s', async (_name, body) => {
			TicketNotification.create.mockClear();
			const res = mockRes();

			await acceptNotificationRequest({ body }, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(TicketNotification.create).not.toHaveBeenCalled();
		});

		it('should not let clients set internal fields such as sentStatus', async () => {
			TicketNotification.create.mockResolvedValue({ ticketId: 'TKT-1' });

			await acceptNotificationRequest(
				{ body: { ...valid, sentStatus: 'SENT' } },
				mockRes()
			);

			expect(TicketNotification.create.mock.calls.at(-1)[0]).not.toHaveProperty('sentStatus');
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

		it('should return 404 when notification does not exist', async () => {
			TicketNotification.findOne.mockResolvedValue(null);

			const res = mockRes();
			await getNotificationById({ query: { id: 'TKT-404' } }, res);

			expect(res.status).toHaveBeenCalledWith(404);
		});

		it('should reject non-string ids (NoSQL injection / array params)', async () => {
			TicketNotification.findOne.mockClear();

			for (const id of [{ $ne: '' }, ['a', 'b'], undefined, '']) {
				const res = mockRes();
				await getNotificationById({ query: { id } }, res);
				expect(res.status).toHaveBeenCalledWith(400);
			}
			expect(TicketNotification.findOne).not.toHaveBeenCalled();
		});

		it('should handle database errors', async () => {
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

			TicketNotification.find.mockReturnValue(mockQuery(mockNotifications));

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
			TicketNotification.find.mockReturnValue(
				mockQuery(Promise.reject(new Error('Database error')))
			);

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

