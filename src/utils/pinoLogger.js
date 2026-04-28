import pino from 'pino';
import env from '../configs/env.config.js';

const transport = pino.transport({
	targets: [
		{
			target: 'pino-pretty',
			level: env.PINO_LOG_LEVEL || 'info',
			options: {
				colorize: true,
				translateTime: 'SYS:standard'
			}
		}
	]
});

const logger = pino(
	{
		level: env.PINO_LOG_LEVEL || 'info',
		timestamp: pino.stdTimeFunctions.isoTime
	},
	transport
);

export default logger;