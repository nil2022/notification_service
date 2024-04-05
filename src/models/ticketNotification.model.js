import mongoose, { Schema } from 'mongoose';
import { ticketSentStatus } from '../utils/constants.js';

const ticketNotificationSchema = new Schema(
    {
        subject: {
            type: String,
            required: [true, 'Not provided']
        },
        ticketId: {
            type: String,
            ref: 'Ticket'
        },
        content: {
            type: String,
            required: true
        },
        requesterEmailIds: {
            type: String,
            required: true
        },
        assignedToEmailIds: {
            type: String,
            required: true
        },
        sentStatus: {
            type: String,
            default: ticketSentStatus.un_sent
        },
        requester: {
            type: String
        },
        assignedTo: {
            type: String
        }
    },
    { timestamps: true }
);

export const TicketNotification = mongoose.model('TicketNotification', ticketNotificationSchema);
