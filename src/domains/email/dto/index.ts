export interface AuthorizationEmailVariables extends Record<string, string> {
  token: string;
  projectName: string;
  integratorName: string;
}

export interface IntegrationConfirmationEmailVariables extends Record<string, string> {
  projectName: string;
}
