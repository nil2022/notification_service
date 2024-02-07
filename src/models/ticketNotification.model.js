const mongoose = require('mongoose');

const ticketNotificationSchema = new mongoose.Schema({
	subject: {
		type: String,
		required: [true, 'Not provided'],
	},
	ticketId: {
		type: String,
		default: Date.now(),
		ref: 'Ticket',
	},
	content: {
		type: String,
		required: [true, 'Not provided'],
	},
	receipientEmails: {
		type: String,
		required: [true, 'Not provided'],
	},
	sentStatus: {
		type: String,
		default: 'UN_SENT',
	},
	requester: {
		type: String,
	}
}, { timestamps: true });

module.exports = mongoose.model('TicketNotification', ticketNotificationSchema);
