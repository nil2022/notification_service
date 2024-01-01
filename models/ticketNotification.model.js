const mongoose = require("mongoose")

const ticketNotificationSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: [true,`Not provided`],
    },
    ticketId: {
        type: String,
        required: [true,`Not provided`],
        ref:"Ticket"
    },
    content: {
        type: String,
        required: [true,`Not provided`],
    },
    receipientEmails: {
        type: [String],
        required: [true,`Not provided`],
    },
    sentStatus: {
        type: String,
        default: "UN_SENT",
    },
    requester: {
        type: String,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: Date.now(),
        // expireAfterSeconds: 604800  //expires after 7 days
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("TicketNotification", ticketNotificationSchema)