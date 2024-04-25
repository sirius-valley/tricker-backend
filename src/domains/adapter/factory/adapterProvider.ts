import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';

export interface AdapterProvider {
  getAdapter: (issueProviderName: string) => ProjectManagementToolAdapter;
}
