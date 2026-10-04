import crypto from 'crypto';
import env from '../configs/env.config.js';

const sha256 = (value) => crypto.createHash('sha256').update(value).digest();

/**
 * Rejects requests that do not carry the shared secret in `x-api-key`.
 * Both sides are hashed first so timingSafeEqual always gets equal-length input.
 */
export const apiKeyAuth = (req, res, next) => {
	const provided = req.get('x-api-key');

	if (
		typeof provided === 'string' &&
		crypto.timingSafeEqual(sha256(provided), sha256(env.API_KEY))
	) {
		return next();
	}

	return res.status(401).json({
		message: 'Unauthorized',
		statusCode: 401,
		success: false
	});
};
