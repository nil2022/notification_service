import { str, num, cleanEnv, port, bool } from 'envalid';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../', '../', '.env');
dotenv.config({ path: envPath });

const envVariables = process.env;

const env = cleanEnv(envVariables, {
	//Server Configuration
	SERVER_PORT: port(),
	NODE_ENV: str({
		choices: ['development', 'production'],
		default: 'development'
	}),

	// Number of reverse-proxy hops to trust for X-Forwarded-* headers (0 = none)
	TRUST_PROXY: num({ default: 1 }),

	// Shared secret that CRM clients must send in the `x-api-key` header
	API_KEY: str({ desc: 'Minimum 32 characters' }),

	// ----------MongoDB URL---------
	DB_URL: str(),

	// ----------CRON-SCHEDULE------------
	CRON_SCHEDULE: str(),

	// BREVO EMAIL CREDENTIALS
	MAIL_HOST: str(),
	MAIL_PORT: num(),
	MAIL_AUTH_SECURE: bool(),
	MAIL_USERNAME: str(),
	MAIL_PASSWORD: str(),
	MAIL_FROM: str(),
	MAIL_REPLY_TO: str(),

	// ##### EXPRESS-RATE-LIMIT CONFIGURATION #####
	//  SPECIFY EXPRESS-RATE-LIMIT TIME IN MINUTES
	RATE_LIMIT_TIME: num(),
	//  SPECIFY MAXIMUM NO. OF REQUESTS PER IP ADDRESS
	MAX_REQUESTS: num(),

	PINO_LOG_LEVEL: str({
		choices: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'],
		default: 'info'
	})
});

if (env.API_KEY.length < 32) {
	throw new Error('API_KEY must be at least 32 characters long');
}

export default env;
