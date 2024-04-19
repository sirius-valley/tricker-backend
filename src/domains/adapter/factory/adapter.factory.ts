import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';

export interface AdapterFactory {
  getSpecificAdapter: (issueProviderName: string) => ProjectManagementToolAdapter;
}
