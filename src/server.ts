import http from 'http';
import app from './app';
import { Constants, Logger } from '@utils';
import dotenv from 'dotenv';
import { checkRequiredEnvVariables } from '@utils/check-env';

dotenv.config();
checkRequiredEnvVariables(['POSTGRES_DB', 'POSTGRES_USER', 'POSTGRES_PASSWORD', 'DATABASE_URL', 'DB_DOCKER_SERVICE', 'DOCKER_DATABASE_URL', 'COGNITO_CLIENT_ID', 'COGNITO_USERPOOL_ID', 'MAILGUN_API_KEY', 'MAILGUN_DOMAIN', 'ENCRYPT_SECRET', 'AUTHORIZATION_SECRET']);

export const server = http.createServer(app);

server.listen(Constants.PORT, () => {
  Logger.info(`Server listening on port ${Constants.PORT}`);
});
