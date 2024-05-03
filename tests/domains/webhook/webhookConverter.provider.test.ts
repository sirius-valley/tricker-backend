import { WebhookConverterProviderImpl } from '@domains/webhook/service';
import { webhookConverterMock } from '../../mock';
import { NotImplementedException } from '@utils';

describe('webhook converter tests', () => {
  describe('WebhookConverterProviderImpl', () => {
    let provider: WebhookConverterProviderImpl;

    beforeEach(() => {
      provider = new WebhookConverterProviderImpl([webhookConverterMock]);
    });

    // Successful retrieval test
    it('should get the correct converter for a supported issue provider', () => {
      const issueProviderName = 'supportedProvider'; // Name supported
      webhookConverterMock.supports.mockReturnValueOnce(true); // Simulate support for this test

      const converter = provider.getWebhookConverter(issueProviderName);

      expect(converter).toBe(webhookConverterMock);
    });

    // Error handling test
    it('should throw an error for an unsupported issue provider', () => {
      const issueProviderName = 'unsupportedProvider'; // Not supported by any mock converter

      try {
        provider.getWebhookConverter(issueProviderName);
        fail('');
      } catch (e: any) {
        expect(e).toBeInstanceOf(NotImplementedException);
        expect(e.message).toBe('Not implemented. No webhook converter available for the chosen Issue Provider. Issue Provider not supported.');
      }
    });
  });
});
