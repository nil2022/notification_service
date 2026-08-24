import pinoHttp from 'pino-http';
import logger from '../utils/pinoLogger.js';

export const httpLogger = pinoHttp({
	logger,
	serializers: {
		req(req) {
			const ip =
				req.headers['x-forwarded-for']?.split(',')[0] ||
				req.ip ||
				req.socket?.remoteAddress ||
				'unknown';

			return {
				method: req.method,
				url: req.url,
				ip // now guaranteed
			};
		},
		res(res) {
			return {
				statusCode: res.statusCode
			};
		}
	}
});
