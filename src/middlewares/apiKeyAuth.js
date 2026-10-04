import crypto from 'crypto';
import env from '../configs/env.config.js';

// Per-process random key: the HMAC is only used to get fixed-length digests for
// timingSafeEqual, never to store or derive anything from the API key.
const HMAC_KEY = crypto.randomBytes(32);
const digest = (value) =>
	crypto.createHmac('sha256', HMAC_KEY).update(value).digest();

/**
 * Rejects requests that do not carry the shared secret in `x-api-key`.
 * Both sides are HMAC'd first so timingSafeEqual always gets equal-length input.
 */
export const apiKeyAuth = (req, res, next) => {
	const provided = req.get('x-api-key');

	if (
		typeof provided === 'string' &&
		crypto.timingSafeEqual(digest(provided), digest(env.API_KEY))
	) {
		return next();
	}

	return res.status(401).json({
		message: 'Unauthorized',
		statusCode: 401,
		success: false
	});
};
