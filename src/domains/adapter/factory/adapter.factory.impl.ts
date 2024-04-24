import { type AdapterFactory } from '@domains/adapter/factory/adapter.factory';
import { type ProjectManagementToolAdapter } from '../projectManagementToolAdapter';
import { LinearAdapter } from '@domains/adapter/linear/linear.adapter';
import { LinearDataRetriever } from '@domains/retriever/linear/linear.dataRetriever';
import { InternalServerErrorException } from '@utils';

export class AdapterFactoryImpl implements AdapterFactory {
  getSpecificAdapter(issueProviderName: string): ProjectManagementToolAdapter {
    switch (issueProviderName) {
      case 'LINEAR':
        return new LinearAdapter(new LinearDataRetriever());
      default:
        throw new InternalServerErrorException('No adapter available for the chosen Issue Provider. Issue Provider not supported.');
    }
  }
}
