import './crons/cron.js';
import mongoose from 'mongoose';
import express from 'express';
import securedHeaders from 'helmet';
import limiter from './utils/api-rate-limiter.js';

const app = express();

app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.json({ limit: '16kb' }));
app.use(limiter); // express-rate-limit middleware
app.use(securedHeaders());

const connectDB = async () => {
    try {
        const startTime = Date.now();
        const connect = await mongoose.connect(process.env.DB_URL);
        console.log(`Time taken to connect to DB: ${Date.now() - startTime}ms`);
        console.log(`MongoDB Connected to Host: ${connect.connection.host}`);
    } catch (error) {
        console.log("Can't connect to DB:", error.message);
    }
};

import notificationRouter from './routes/ticketNotification.route.js';
app.use('/api/v1/notify', notificationRouter);

// FIRST CONNECT TO MONGODB THEN START LISTENING TO REQUESTS
connectDB()
    .then(() => {
        app.listen(process.env.SERVER_PORT || 8000, () => {
            console.log(
                `Notification service listening to PORT ${process.env.SERVER_PORT}`
            );
        });
    })
    .catch((err) => console.log(err)); // IF DB CONNECT FAILED, CATCH ERROR

app.get('/', (_, res) => {
  console.log('Notification Service is up and Running 🚀');
    return res.status(200).json({
        message: 'Notification Service is up and Running 🚀',
        statusCode: 200,
        success: true
    });
});
