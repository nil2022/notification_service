import './crons/cron.js';
import mongoose from 'mongoose';
import express from 'express';
import securedHeaders from 'helmet';
import limiter from './utils/api-rate-limiter.js';
import { httpLogger } from './middlewares/httpLogger.js';
import chalk from 'chalk';
import notificationRouter from './routes/ticketNotification.route.js';
import env from './configs/env.config.js';
import logger from './utils/pinoLogger.js';

// Strip Mongo operators ($ne, $gt...) from any filter built from user input
mongoose.set('sanitizeFilter', true);

const app = express();

// Only trust a known number of proxy hops; `true` lets clients spoof their IP via X-Forwarded-For
app.set('trust proxy', env.TRUST_PROXY);
app.use(securedHeaders());
app.use(limiter);
app.use(httpLogger);
app.use(express.urlencoded({ extended: false, limit: '16kb' }));
app.use(express.json({ limit: '16kb' }));

const connectDB = async () => {
	const startTime = Date.now();
	const connect = await mongoose.connect(env.DB_URL);
	logger.info(`Time taken to connect to DB: ${Date.now() - startTime}ms`);
	const { host, name: dbName } = connect.connection;
	console.log(
		chalk.bgGreen.black(
			` MongoDB Connected to DB Host:-> ${host} , DB Name:-> ${dbName} `
		)
	);
};

app.use('/api/v1/notify', notificationRouter);

app.get('/', (_, res) => {
	logger.info('Notification Service is up and Running !');
	return res.status(200).json({
		message: 'Notification Service is up and Running 👍🏻',
		statusCode: 200,
		success: true
	});
});

app.use((_, res) =>
	res.status(404).json({
		message: 'Not Found',
		statusCode: 404,
		success: false
	})
);

// Never leak stack traces / internals to clients (also covers malformed JSON bodies)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
	const status = err.status >= 400 && err.status < 500 ? err.status : 500;
	if (status === 500) logger.error(err, 'Unhandled error');
	res.status(status).json({
		message: status === 500 ? 'Internal Server Error!' : 'Bad Request',
		statusCode: status,
		success: false
	});
});

// FIRST CONNECT TO MONGODB THEN START LISTENING TO REQUESTS
connectDB()
	.then(() => {
		app.listen(env.SERVER_PORT || 8000, () => {
			logger.info(
				`Notification service listening to PORT ${env.SERVER_PORT}`
			);
		});
	})
	.catch((err) => logger.error(err, "Can't connect to DB:")); // IF DB CONNECT FAILED, CATCH ERROR
