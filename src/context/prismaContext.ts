import { type PrismaClient } from '@prisma/client';
import { mockDeep, type DeepMockProxy } from 'jest-mock-extended';

export interface Context {
  prisma: PrismaClient;
}

export interface MockContext {
  prisma: DeepMockProxy<PrismaClient>;
}

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  };
};
