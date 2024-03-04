import { type PendingProjectAuthorizationRepository } from '@domains/pendingProjectAuthorization/repository';
import { PendingProjectAuthorizationDTO, type PendingProjectInputDTO } from '@domains/pendingProjectAuthorization/dto';

export class PendingProjectAuthorizationRepositoryMock implements PendingProjectAuthorizationRepository {
  async create(data: PendingProjectInputDTO): Promise<PendingProjectAuthorizationDTO> {
    return new PendingProjectAuthorizationDTO({
      id: 'ppaId',
      providerProjectId: 'ppId',
      token: 'token',
      issueProviderId: 'ipId',
      integratorId: 'iId',
      organizationId: 'oId',
    });
  }

  async getByProjectId(providerProjectId: string): Promise<PendingProjectAuthorizationDTO | null> {
    return null;
  }

  async delete(id: string): Promise<PendingProjectAuthorizationDTO> {
    return new PendingProjectAuthorizationDTO({
      id: 'ppaId',
      providerProjectId: 'ppId',
      token: 'token',
      issueProviderId: 'ipId',
      integratorId: 'iId',
      organizationId: 'oId',
    });
  }
}
