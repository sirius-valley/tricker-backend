import http from 'http';
import app from './app';
import { Constants, Logger, NodeEnv } from '@utils';
import dotenv from 'dotenv';
import { checkRequiredEnvVariables } from '@utils/check-env';
import ngrok from '@ngrok/ngrok';
import process from 'process';

dotenv.config();
checkRequiredEnvVariables([
  'POSTGRES_DB',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'DATABASE_URL',
  'DB_DOCKER_SERVICE',
  'DOCKER_DATABASE_URL',
  'COGNITO_CLIENT_ID',
  'COGNITO_USERPOOL_ID',
  'MAILGUN_API_KEY',
  'MAILGUN_DOMAIN',
  'ENCRYPT_SECRET',
  'AUTHORIZATION_SECRET',
  'NODE_ENV',
  'NGROK_AUTH_TOKEN',
  'NGROK_STATIC_DOMAIN',
]);

export const server = http.createServer(app);

server.listen(Constants.PORT, (): void => {
  Logger.info(`Server listening on port ${Constants.PORT}`);
});

// Establish ngrok connectivity
if (Constants.NODE_ENV === NodeEnv.DEV) {
  (async function (): Promise<void> {
    const listener: ngrok.Listener = await ngrok.forward({
      addr: 8080,
      authtoken: process.env.NGROK_AUTH_TOKEN,
      proto: 'http',
      schemes: ['HTTPS'],
      domain: process.env.NGROK_STATIC_DOMAIN,
    });

    // Output ngrok url to console
    console.log(`Ngrok ingress established at: ${listener.url()}\nCheck ngrok health clicking: ${listener.url()}/api/health/`);
  })();
}
