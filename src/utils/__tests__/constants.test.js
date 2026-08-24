import { ticketSentStatus } from '../../utils/constants.js';

describe('Constants', () => {
	describe('ticketSentStatus', () => {
		it('should have all required status values', () => {
			expect(ticketSentStatus).toHaveProperty('un_sent', 'UN_SENT');
			expect(ticketSentStatus).toHaveProperty('sent', 'SENT');
			expect(ticketSentStatus).toHaveProperty('failed', 'FAILED');
			expect(ticketSentStatus).toHaveProperty('cancelled', 'CANCELLED');
			expect(ticketSentStatus).toHaveProperty('delivered', 'DELIVERED');
		});

		it('should have exactly 5 status values', () => {
			expect(Object.keys(ticketSentStatus)).toHaveLength(5);
		});

		it('should all status values be strings', () => {
			Object.values(ticketSentStatus).forEach((status) => {
				expect(typeof status).toBe('string');
			});
		});
	});
});
