import { str, num, cleanEnv, port } from 'envalid';
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

	// ----------MongoDB URL---------
	DB_URL: str(),

	// ----------CRON-SCHEDULE------------
	CRON_SCHEDULE: str(),
	
	// BREVO EMAIL CREDENTIALS
	MAIL_HOST: str(),
	MAIL_PORT: num(),
	MAIL_USERNAME: str(),
	MAIL_PASSWORD: str(),
	MAIL_FROM: str(),
	MAIL_REPLY_TO: str(),

	// ##### EXPRESS-RATE-LIMIT CONFIGURATION #####
	//  SPECIFY EXPRESS-RATE-LIMIT TIME IN MINUTES
	RATE_LIMIT_TIME: num(),
	//  SPECIFY MAXIMUM NO. OF REQUESTS PER IP ADDRESS
	MAX_REQUESTS: num(),

	PINO_LOG_LEVEL: str()
});

export default env;
