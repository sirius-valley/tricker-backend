/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleNameMapper: {
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@utils$': '<rootDir>/src/utils',
    '^@domains/(.*)$': '<rootDir>/src/domains/$1',
    '^@domains$': '<rootDir>/src/domains',
    '^@app$': '<rootDir>/src/app',
    '^@router$': '<rootDir>/src/router',
  },
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};

export default config;
