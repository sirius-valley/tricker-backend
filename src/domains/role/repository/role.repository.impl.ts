import { type RoleRepository } from '@domains/role/repository/role.repository';
import { RoleDTO } from '@domains/role/dto';
import { type PrismaClient, type Role } from '@prisma/client';

export class RoleRepositoryImpl implements RoleRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(name: string): Promise<RoleDTO> {
    const role: Role = await this.db.role.create({
      data: {
        name,
      },
    });

    return new RoleDTO(role);
  }

  async getById(roleId: string): Promise<null | RoleDTO> {
    const role: Role | null = await this.db.role.findUnique({
      where: {
        id: roleId,
      },
    });

    return role == null ? null : new RoleDTO(role);
  }

  async getByName(name: string): Promise<RoleDTO | null> {
    const role: Role | null = await this.db.role.findFirst({
      where: {
        name,
      },
    });

    return role == null ? null : new RoleDTO(role);
  }

  /**
   * Retrieves all roles from the database.
   * @returns A Promise that resolves with an array of RoleDTO objects representing the retrieved roles.
   */
  async getRoles(): Promise<RoleDTO[]> {
    const roles = await this.db.role.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return roles.map((role) => new RoleDTO(role));
  }
}
