export interface AuthorizationEmailVariables extends Record<string, string> {
  token: string;
  projectName: string;
  projectId: string;
  integratorName: string;
  url: string;
}

export interface IntegrationConfirmationEmailVariables extends Record<string, string> {
  projectName: string;
  projectId: string;
  url: string;
}
