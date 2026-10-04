import crypto from 'crypto';
import env from '../configs/env.config.js';

/**
 * Rejects requests that do not carry the shared secret in `x-api-key`.
 * The key is compared directly in constant time (no hashing needed: it is a
 * high-entropy random secret, not a user password). Only its length can leak,
 * which does not help an attacker guess a random key.
 */
export const apiKeyAuth = (req, res, next) => {
	const provided = req.get('x-api-key');

	if (typeof provided === 'string') {
		const providedBuf = Buffer.from(provided);
		const expectedBuf = Buffer.from(env.API_KEY);

		if (
			providedBuf.length === expectedBuf.length &&
			crypto.timingSafeEqual(providedBuf, expectedBuf)
		) {
			return next();
		}
	}

	return res.status(401).json({
		message: 'Unauthorized',
		statusCode: 401,
		success: false
	});
};
