import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import serverless from 'serverless-http';

import { Constants, NodeEnv, specs } from '@utils';
import { ErrorHandling } from '@utils/errors';
import { router } from '@router';

require('express-async-errors');

export const app = express();

// Set up request logger
if (Constants.NODE_ENV === NodeEnv.DEV) {
  app.use(morgan('tiny')); // Log requests only in development environments
}

// Set up request parsers
app.use(express.json()); // Parses application/json payloads request bodies
app.use(express.urlencoded({ extended: false })); // Parse application/x-www-form-urlencoded request bodies
app.use(cookieParser()); // Parse cookies

// Set up CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/api', router);

app.use(ErrorHandling);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs as swaggerUi.JsonObject, { explorer: true }));

export default app;

export const handler = serverless(app);
