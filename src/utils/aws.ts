import * as process from 'process';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { type CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import type { CustomCognitoIdTokenPayload } from '@domains/user';

const { COGNITO_CLIENT_ID, COGNITO_USERPOOL_ID } = process.env;

export const verifyIdAwsToken = async (token: string): Promise<CustomCognitoIdTokenPayload> => {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: COGNITO_USERPOOL_ID!,
    tokenUse: 'id',
  });

  return (await verifier.verify(token, {
    clientId: COGNITO_CLIENT_ID!,
  })) as unknown as CustomCognitoIdTokenPayload;
};

export const verifyAwsAccessToken = async (token: string): Promise<CognitoAccessTokenPayload> => {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: COGNITO_USERPOOL_ID!,
    tokenUse: 'access',
  });

  return await verifier.verify(token, {
    clientId: COGNITO_CLIENT_ID!,
  });
};
