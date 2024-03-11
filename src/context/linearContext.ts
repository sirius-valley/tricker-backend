import { LinearClient } from '@linear/sdk';

export const createLinearClient = (apiKey: string): LinearClient => {
  return new LinearClient({
    apiKey,
  });
};
