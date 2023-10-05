const mongoose = require("mongoose")

const ticketNotificationSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: [true,`Not provided`],
    },
    ticketId: {
        type: String,
        required: [true,`Not provided`]
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
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    //Expires in 7 Days
    expireAt: {
        type: Date,
        default: Date.now(),
        expires: 604800
      }
})

module.exports = mongoose.model("TicketNotification", ticketNotificationSchema)