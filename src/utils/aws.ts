import * as process from 'process';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { type CognitoAccessTokenPayload, type CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';

const { COGNITO_CLIENT_ID, COGNITO_USERPOOL_ID } = process.env;

export const verifyIdAwsToken = async (token: string): Promise<CognitoIdTokenPayload> => {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: COGNITO_USERPOOL_ID!,
    tokenUse: 'id',
  });

  return await verifier.verify(token, {
    clientId: COGNITO_CLIENT_ID!,
  });
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

// const cognitoClient = new CognitoIdentityProviderClient({
//   credentials: fromEnv(),
//   region: AWS_REGION,
//   apiVersion: '2016-04-18'
// })

/*
async getTokens(authCode: string): Promise<Tokens | undefined> {
  try {
    const res = await axios.get<CognitoTokenResponse>(`${COGNITO_DOMAIN}/oauth2/token`, {
      params: {
        grant_type: 'authorization_code',
        client_id: COGNITO_CLIENT_ID,
        code: authCode,
        redirect_uri: COGNITO_REDIRECT_URI
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    return new Tokens(res.data)
  }
  catch (e: any) {
    throw new Error('error')
  }
}
*/

/*
async getUserInfo(accessToken: string, idToken: string): Promise<void> {

  const command = new AdminGetUserCommand({
    UserPoolId: COGNITO_USERPOOL_ID,
    Username: sub
  });

  return await cognitoClient.send(command);
}
*/
