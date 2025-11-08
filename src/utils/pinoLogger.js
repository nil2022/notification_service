import pino from 'pino';
import env from '../configs/env.config.js';

const allTransport = pino.transport({
	targets: [
		// {
		// 	target: 'pino/file',
		// 	options: { 
        //         destination: `./logs/notification-service.log`, 
        //     },
        //     level: env.PINO_LOG_LEVEL || 'info',
		// },
        {
            target: 'pino-pretty',
            level: env.PINO_LOG_LEVEL || 'info',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
            },

        },
	],
});

export default pino(
	{
		level: env.PINO_LOG_LEVEL || 'info',
        timestamp: pino.stdTimeFunctions.isoTime,
        // redact: {
        //     paths: ['password'],
        //     censor: '***',
        //     remove: true
        // },
	},
    allTransport
);
