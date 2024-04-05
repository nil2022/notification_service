import { rateLimit } from 'express-rate-limit';
import logger from './pinoLogger.js';

const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_TIME * 60 * 1000 || 15 * 60 * 1000, // default is 15 minutes
    limit: process.env.MAX_REQUESTS || 10, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
    skipFailedRequests: true, // If any request failed that will not count
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req) =>
        `${req.protocol}://${req.hostname}${req.originalUrl}`,
    message: async (req, res) => {
        logger.warn(`\n${req.protocol}://${req.headers['host']} [${req.method}] -> API is Rate-limited`)
        return res.status(429).json({
            message: 'Too many requests, please try again later.',
            statusCode: 429,
            success: false
        });
    }
});

export default limiter;
