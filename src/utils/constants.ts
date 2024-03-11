// Runtime environments
export enum NodeEnv {
  DEV = 'development',
  PROD = 'production',
}

// Logging levels
export enum LogLevel {
  INFO = 'info',
  DEBUG = 'debug',
  WARN = 'warn',
  ERROR = 'error',
}

interface ConstantsTypes {
  NODE_ENV: NodeEnv;
  LOG_LEVEL: LogLevel;
  PORT: string;
  CORS_WHITELIST: string | string[];
  TOKEN_SECRET: string;
}

// Environment variables, casting to correct type and setting default values for them.
export const Constants: ConstantsTypes = {
  // Node runtime environment
  NODE_ENV: (process.env.NODE_ENV ?? NodeEnv.DEV) as NodeEnv,
  // Logging level
  LOG_LEVEL: (process.env.LOG_LEVEL ?? LogLevel.INFO) as LogLevel,
  // Port to run the server in
  PORT: process.env.PORT ?? '8080',
  // CORS urls to allow
  CORS_WHITELIST: process.env.CORS_WHITELIST ?? '*',
  // Authentication secret
  TOKEN_SECRET: process.env.AUTHORIZATION_SECRET ?? 'secret',
};
