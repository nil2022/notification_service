import pino from 'pino';

const allTransport = pino.transport({
	targets: [
		// {
		// 	target: 'pino/file',
		// 	options: { 
        //         destination: `./logs/notification-service.log`, 
        //     },
        //     level: process.env.PINO_LOG_LEVEL || 'info',
		// },
        {
            target: 'pino-pretty',
            level: process.env.PINO_LOG_LEVEL || 'info',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
            },

        },
	],
});

export default pino(
	{
		level: process.env.PINO_LOG_LEVEL || 'info',
        timestamp: pino.stdTimeFunctions.isoTime,
        // redact: {
        //     paths: ['password'],
        //     censor: '***',
        //     remove: true
        // },
	},
    allTransport
);
