import { type AdapterProvider } from '@domains/adapter/factory/adapterProvider';
import { type ProjectManagementToolAdapter } from '../projectManagementToolAdapter';
import { LinearAdapter } from '@domains/adapter/linear/linear.adapter';
import { LinearDataRetriever } from '@domains/retriever/linear/linear.dataRetriever';

const linearRetriever = new LinearDataRetriever();
const linearAdapter = new LinearAdapter(linearRetriever);

export class AdapterProviderImpl implements AdapterProvider {
  private readonly adapters: ProjectManagementToolAdapter[] = [linearAdapter];

  getAdapter(issueProviderName: string): ProjectManagementToolAdapter {
    const adapter: ProjectManagementToolAdapter | undefined = this.adapters.find((adapter) => adapter.supports(issueProviderName));
    if (adapter === undefined) throw new Error('No adapter available for the chosen Issue Provider. Issue Provider not supported.');
    return adapter;
  }
}
