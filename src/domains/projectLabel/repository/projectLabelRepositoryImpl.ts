import { type ProjectLabelRepository } from '@domains/projectLabel/repository/projectLabelRepository';
import { ProjectLabelDTO } from '@domains/projectLabel/dto';
import type { PrismaClient, ProjectLabel } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';

export class ProjectLabelRepositoryImpl implements ProjectLabelRepository {
  constructor(private readonly db: Omit<PrismaClient, ITXClientDenyList>) {}

  /**
   * Creates a new project-related label in the database.
   * @param {Object} data - The data for the new project label.
   * @param {string} data.name - The name of the project label.
   * @param {string} data.projectId - The ID of the project associated with the label.
   * @returns {Promise<ProjectLabelDTO>} A promise that resolves to the created project label DTO.
   */
  async create({ name, projectId }: { name: string; projectId: string }): Promise<ProjectLabelDTO> {
    const label: ProjectLabel = await this.db.projectLabel.create({
      data: {
        name,
        projectId,
      },
    });

    return new ProjectLabelDTO(label);
  }

  /**
   * Retrieves a project-related label by its name and project ID.
   * @param {Object} params - The parameters for the query.
   * @param {string} params.name - The name of the project label to retrieve.
   * @param {string} params.projectId - The ID of the project associated with the label.
   * @returns {Promise<ProjectLabelDTO | null>} A promise that resolves to the project label DTO if found, or null if not found.
   */
  async getByNameAndProjectId({ name, projectId }: { name: string; projectId: string }): Promise<ProjectLabelDTO | null> {
    const label: ProjectLabel | null = await this.db.projectLabel.findUnique({
      where: {
        projectId_name: {
          name,
          projectId,
        },
      },
    });

    return label === null ? null : new ProjectLabelDTO(label);
  }
}
