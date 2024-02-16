import { type RoleRepository } from '@domains/role/repository/role.repository';
import { RoleDTO } from '@domains/role/dto';
import { type PrismaClient } from '@prisma/client';

export class RoleRepositoryImpl implements RoleRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(name: string): Promise<RoleDTO> {
    const role = await this.db.role.create({
      data: {
        name,
      },
    });

    return new RoleDTO(role);
  }

  async getById(roleId: string): Promise<null | RoleDTO> {
    const role = await this.db.role.findUnique({
      where: {
        id: roleId,
      },
    });

    return role == null ? null : new RoleDTO(role);
  }

  async getByName(name: string): Promise<RoleDTO | null> {
    const role = await this.db.role.findFirst({
      where: {
        name,
      },
    });

    return role == null ? null : new RoleDTO(role);
  }
}
