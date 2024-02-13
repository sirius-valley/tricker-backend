import { type PendingUserRepository } from '@domains/pendingUser/repository';
import { type PendingUserDTO } from '@domains/pendingUser/dto';

export class PendingUserRepositoryMock implements PendingUserRepository {
  async create(email: string, projectId: string): Promise<PendingUserDTO> {
    await Promise.resolve(undefined);
  }

  async getByEmailAndProject(email: string, projectId: string): Promise<PendingUserDTO | null> {
    if (projectId === 'idNull') {
      return null;
    }
  }
}
