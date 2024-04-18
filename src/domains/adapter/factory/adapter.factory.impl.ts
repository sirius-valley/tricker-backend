import { type AdapterFactory } from '@domains/adapter/factory/adapter.factory';
import { type ProjectManagementToolAdapter } from '../projectManagementToolAdapter';
import { InternalServerErrorException } from '@utils';
import { linearAdapter } from '@dependencies';

export class AdapterFactoryImpl implements AdapterFactory {
  getSpecificAdapter(issueProviderName: string): ProjectManagementToolAdapter {
    switch (issueProviderName) {
      case 'linear':
        return linearAdapter;
      default:
        throw new InternalServerErrorException('No adapter available for the chosen Issue Provider. Issue Provider not supported.');
    }
  }
}
