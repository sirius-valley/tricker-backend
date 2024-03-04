import { LinearClient } from '@linear/sdk';

export const initializeLinearClient = (apikey: string): LinearClient => {
  return new LinearClient({
    apiKey: apikey,
  });
};
