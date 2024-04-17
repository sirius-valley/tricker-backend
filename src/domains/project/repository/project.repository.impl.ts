import { type ProjectRepository } from '@domains/project/repository/project.repository';
import { ProjectBasicDTO, ProjectDetailsDTO, ProjectDTO, type ProjectsFilterInput } from '@domains/project/dto';
import { type PrismaClient, type Project } from '@prisma/client';
import { UserRoleDTO } from '@domains/userProjectRole/dto';
import { BasicUserDTO } from '@domains/user';
import { RoleDTO } from '@domains/role/dto';

export class ProjectRepositoryImpl implements ProjectRepository {
  constructor(private readonly db: PrismaClient) {}

  /**
   * Fetches a project by our own ID.
   *
   * @param {string} projectId - ID of the project to retrieve.
   * @returns {Promise<null | ProjectDTO>} - Promise resolving to a ProjectDTO object if found, otherwise null.
   */
  async getById(projectId: string): Promise<null | ProjectDTO> {
    const project: Project | null = await this.db.project.findUnique({
      where: {
        id: projectId,
        deletedAt: null,
      },
    });

    return project === null ? null : new ProjectDTO(project);
  }

  /**
   * Fetches a project by the ID the project has in the issue provider platform (ex. Linear).
   *
   * @param {string} providerId - ID of the external provider platform where the project is hosted.
   * @returns {Promise<ProjectDTO | null>} - Promise resolving to a ProjectDTO object if found, otherwise null.
   */
  async getByProviderId(providerId: string): Promise<ProjectDTO | null> {
    const project: Project | null = await this.db.project.findFirst({
      where: {
        providerId,
        deletedAt: null,
      },
    });

    return project === null ? null : new ProjectDTO(project);
  }

  /**
   * Fetches detailed information about a project, including associated users and roles.
   * @param input - An object containing user ID and project ID for project retrieval.
   * @param {string} input.projectId - ID of the project to retrieve details for.
   * @param {string} input.userId - ID of the user requesting project details (used for access control).
   * @returns {Promise<ProjectDetailsDTO | null>} - Promise resolving to a ProjectDetailsDTO object if found and user has access, otherwise null.
   */
  async getProjectDetails({ userId, projectId }: { userId: string; projectId: string }): Promise<ProjectDetailsDTO | null> {
    const details = await this.db.project.findFirst({
      where: {
        AND: [
          {
            id: projectId,
            deletedAt: null,
          },
          {
            usersRoles: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      include: {
        usersRoles: {
          include: {
            user: true,
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        issueProvider: true,
      },
    });

    return details == null
      ? null
      : new ProjectDetailsDTO({
          createdAt: details.createdAt,
          deletedAt: details.deletedAt,
          id: details.id,
          image: details.image,
          issueProvider: details.issueProvider,
          issueProviderId: details.issueProviderId,
          name: details.name,
          organizationId: details.organizationId,
          providerId: details.providerId,
          updatedAt: details.updatedAt,
          url: details.url,
          usersAndRoles: details.usersRoles.map(
            (userRole) =>
              new UserRoleDTO({
                ...userRole,
                user: new BasicUserDTO(userRole.user),
                role: new RoleDTO(userRole.role),
                isAccepted: userRole.isAccepted,
              })
          ),
        });
  }

  /**
   * Deletes a project by its ID using soft deletion.
   *
   * This method performs a database transaction to ensure data consistency. It updates
   * the project and related entities by setting their "deletedAt" field to the current date.
   *
   * @param {string} projectId - The unique identifier of the project to delete.
   * @returns {Promise<string>} - A promise that resolves to the deleted project ID.
   */
  async delete(projectId: string): Promise<string> {
    const project = await this.db.$transaction(async (tx) => {
      await tx.userProjectRole.updateMany({
        where: {
          project: {
            id: projectId,
            deletedAt: null,
          },
        },
        data: {
          deletedAt: new Date(),
        },
      });

      await tx.projectLabel.updateMany({
        where: {
          project: {
            id: projectId,
            deletedAt: null,
          },
        },
        data: {
          deletedAt: new Date(),
        },
      });

      await tx.projectStage.updateMany({
        where: {
          project: {
            id: projectId,
            deletedAt: null,
          },
        },
        data: {
          deletedAt: new Date(),
        },
      });

      await tx.issue.updateMany({
        where: {
          project: {
            id: projectId,
            deletedAt: null,
          },
        },
        data: {
          deletedAt: new Date(),
        },
      });

      await tx.manualTimeModification.updateMany({
        where: {
          issue: {
            project: {
              id: projectId,
              deletedAt: null,
            },
          },
        },
        data: {
          deletedAt: new Date(),
        },
      });

      await tx.timeTracking.updateMany({
        where: {
          issue: {
            project: {
              id: projectId,
              deletedAt: null,
            },
          },
        },
        data: {
          deletedAt: new Date(),
        },
      });

      await tx.issueChangeLog.updateMany({
        where: {
          issue: {
            project: {
              id: projectId,
              deletedAt: null,
            },
          },
        },
        data: {
          deletedAt: new Date(),
        },
      });

      await tx.issueCustomFields.updateMany({
        where: {
          issue: {
            project: {
              id: projectId,
              deletedAt: null,
            },
          },
        },
        data: {
          deletedAt: new Date(),
        },
      });

      await tx.blockerStatusModification.updateMany({
        where: {
          issue: {
            project: {
              id: projectId,
              deletedAt: null,
            },
          },
        },
        data: {
          deletedAt: new Date(),
        },
      });

      return await tx.project.update({
        where: {
          id: projectId,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    });

    return project.id;
  }

  /**
   * Retrieves projects based on the provided filter input.
   * @param input - The input object containing the filter criteria.
   * @returns An array of ProjectBasicDTO objects representing the retrieved projects.
   */
  async getProjectsByUserId(input: ProjectsFilterInput): Promise<ProjectBasicDTO[]> {
    const projects = await this.db.project.findMany({
      where: {
        deletedAt: null,
        usersRoles: {
          some: {
            userId: input.userId,
          },
        },
        name: {
          contains: input.projectName ?? '',
          mode: 'insensitive',
        },
      },
    });

    return projects.map((project) => new ProjectBasicDTO({ ...project, image: project.image ?? undefined }));
  }
}
