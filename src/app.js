import './crons/cron.js';
import mongoose from 'mongoose';
import express from 'express';
import securedHeaders from 'helmet';
import limiter from './utils/api-rate-limiter.js';
import logger from './utils/pinoLogger.js';
import pinoHTTP from 'pino-http';
import chalk from 'chalk';
import notificationRouter from './routes/ticketNotification.route.js';
import env from './configs/env.config.js';

const app = express();

/************************************************** */
// logger.fatal('fatal');
// logger.error('error');
// logger.warn('warn');
// logger.info('info');
// logger.debug('debug');
// logger.trace('trace');

/** ***************************************************** */

app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.json({ limit: '16kb' }));
app.use(limiter); // express-rate-limit middleware
app.use(securedHeaders());
app.use(pinoHTTP({ logger }));

const connectDB = async () => {
	const startTime = Date.now();
	const connect = await mongoose.connect(env.DB_URL);
	logger.info(`Time taken to connect to DB: ${Date.now() - startTime}ms`);
	// logger.info(`MongoDB Connected to Host: ${connect.connection.host}`);
	const { host, name: dbName } = connect.connection;
	console.log(
		chalk.bgGreen.black(
			` MongoDB Connected to DB Host:-> ${host} , DB Name:-> ${dbName} `
		)
	);
};

app.use('/api/v1/notify', notificationRouter);

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

app.get('/', (_, res) => {
	logger.info('Notification Service is up and Running !');
	return res.status(200).json({
		message: 'Notification Service is up and Running 👍🏻',
		statusCode: 200,
		success: true
	});
});
