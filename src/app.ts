import express, { type Response } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import serverless from 'serverless-http';

import { Constants, NodeEnv, specs } from '@utils';
import { ErrorHandling } from '@utils/errors';
import { router } from '@router';
import { type CustomRequest } from '@domains/webhook/middleware/webhooksMiddleware';
require('express-async-errors');

export const app = express();

// Set up request logger
if (Constants.NODE_ENV === NodeEnv.DEV) {
  app.use(morgan('tiny')); // Log requests only in development environments
}

// Save raw body buffer before JSON parsing
app.use(
  express.json({
    verify: (req: CustomRequest, res: Response, buf: Buffer) => {
      req.rawBody = buf;
    },
  })
);

// Set up request parsers
app.use(express.json()); // Parses application/json payloads request bodies
app.use(express.urlencoded({ extended: false })); // Parse application/x-www-form-urlencoded request bodies
app.use(cookieParser()); // Parse cookies

// Set up CORS
app.use(
  cors({
    origin: Constants.CORS_WHITELIST,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'linear-signature'],
  })
);

app.use('/api', router);

app.use(ErrorHandling);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs as swaggerUi.JsonObject, { explorer: true }));

export default app;

export const handler = serverless(app);
