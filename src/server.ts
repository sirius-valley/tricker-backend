import http from 'http';
import app from './app';
import { Constants, Logger } from '@utils';

export const server = http.createServer(app);

server.listen(Constants.PORT, () => {
  Logger.info(`Server listening on port ${Constants.PORT}`);
});
