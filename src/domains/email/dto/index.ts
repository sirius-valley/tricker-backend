export interface AuthorizationEmailVariables extends Record<string, string> {
  acceptanceToken: string;
  denialToken: string;
  projectName: string;
  projectId1: string;
  projectId2: string;
  integratorName: string;
  acceptanceUrl: string;
  denialUrl: string;
}

export interface IntegrationConfirmationEmailVariables extends Record<string, string> {
  projectName: string;
  projectId: string;
  url: string;
}

export interface IntegrationRequestEmailVariables extends Record<string, string> {
  projectName: string;
}
