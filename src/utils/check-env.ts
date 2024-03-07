/**
 * Function to check if all required environment variables are set
 */
export const checkRequiredEnvVariables = (requiredEnvVars: string[]): void => {
  const missingVars = requiredEnvVars.filter((varName) => !(varName in process.env));

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};
