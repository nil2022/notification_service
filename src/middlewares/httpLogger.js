import pinoHttp from 'pino-http';
import logger from '../utils/pinoLogger.js';

export const httpLogger = pinoHttp({
	logger,
	serializers: {
		req(req) {
			// req.ip honours the configured `trust proxy` setting, so a client
			// can't forge the logged address through X-Forwarded-For
			const ip = req.ip || req.socket?.remoteAddress || 'unknown';

			return {
				method: req.method,
				url: req.url,
				ip
			};
		},
		res(res) {
			return {
				statusCode: res.statusCode
			};
		}
	}
});
