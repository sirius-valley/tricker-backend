import { type IntegrationRepository } from '@domains/integration/repository/integration.repository';
import { type AuthorizationRequestDTO } from '@domains/integration/dto';
import { PendingProjectAuthorizationDTO } from '@domains/pendingProjectAuthorization/dto';
import type { PrismaClient } from '@prisma/client';
import { encryptData, Logger } from '@utils';
import { type IntegratedProjectCreationInput, ProjectDTO } from '@domains/project/dto';

export class IntegrationRepositoryImpl implements IntegrationRepository {
  constructor(private readonly db: PrismaClient) {}

  async createIntegrationProjectRequest(input: AuthorizationRequestDTO): Promise<PendingProjectAuthorizationDTO> {
    const result = await this.db.pendingProjectAuthorization.create({
      data: {
        integratorId: input.integratorId,
        providerProjectId: input.projectId,
        token: encryptData(input.apiToken),
        emails: {
          createMany: {
            data: input.members.map((member) => {
              return { email: member.email };
            }),
          },
        },
        organization: {
          connect: {
            // if the org does not exist, then we create it. otherwise, we create a relation with the existing one
            name: input.organizationName,
          },
        },
        issueProvider: {
          // same as above but with issue provider (linear, jira, etc.)
          connect: {
            name: input.issueProviderName.trim().toUpperCase(),
          },
        },
      },
    });
    return new PendingProjectAuthorizationDTO(result);
  }

  /**
   * Creates a new integrated project in the database.
   *
   * @param {IntegratedProjectCreationInput} input - The input data for creating the project.
   * @returns {Promise<ProjectDTO>} - A promise that resolves to a ProjectDTO object representing the created project.
   */
  async createIntegratedProject(input: IntegratedProjectCreationInput): Promise<ProjectDTO> {
    Logger.time('Project Integration TX');
    const newProject = await this.db.$transaction(
      async (tx) => {
        const newProject = await tx.project.create({
          data: {
            name: input.project.projectName,
            providerId: input.project.projectId,
            image: input.project.image,
            organization: {
              connect: {
                id: input.organizationId,
              },
            },
            url: input.project.url,
            issueProvider: {
              connect: {
                name: input.issueProviderName,
              },
            },
            usersRoles: {
              create: input.users.map((user) => ({
                isAccepted: input.authorizedUsers.some((acceptedUserEmail) => acceptedUserEmail === user.email),
                user: {
                  connectOrCreate: {
                    where: {
                      email: user.email,
                    },
                    create: {
                      email: user.email,
                      name: user.name,
                    },
                  },
                },
                role: {
                  connectOrCreate: {
                    where: {
                      name: user.roleName,
                    },
                    create: {
                      name: user.roleName,
                    },
                  },
                },
                userEmitter: {
                  connect: {
                    email: input.integratorEmail,
                  },
                },
              })),
            },
            projectStages: {
              create: input.project.stages.map((stage) => ({
                name: stage.name,
                type: stage.type,
                color: stage.color,
                position: stage.position,
              })),
            },
            labels: {
              create: input.project.labels.map((labelName) => ({
                name: labelName,
              })),
            },
          },
        });

        for (const issue of input.project.issues) {
          await tx.issue.create({
            data: {
              project: {
                connect: {
                  id: newProject.id,
                },
              },
              author:
                issue.authorEmail != null
                  ? {
                      connect: {
                        email: issue.authorEmail,
                      },
                    }
                  : undefined,
              assignee:
                issue.assigneeEmail != null
                  ? {
                      connect: {
                        email: issue.assigneeEmail,
                      },
                    }
                  : undefined,
              stage:
                issue.stage != null
                  ? {
                      connect: {
                        projectId_name: {
                          projectId: newProject.id,
                          name: issue.stage,
                        },
                      },
                    }
                  : undefined,
              labels: {
                connect: issue.labels.map((labelName) => ({
                  projectId_name: {
                    projectId: newProject.id,
                    name: labelName,
                  },
                })),
              },
              description: issue.description,
              storyPoints: issue.storyPoints,
              priority: issue.priority,
              name: issue.name,
              title: issue.title,
              providerIssueId: issue.providerIssueId,
              blockerStatusModifications: {
                create: issue.blockingEvents.map((event) => ({
                  providerEventId: event.providerEventId,
                  userEmitter:
                    event.userEmitterEmail != null
                      ? {
                          connect: {
                            email: event.userEmitterEmail,
                          },
                        }
                      : undefined,
                  eventRegisteredAt: event.createdAt,
                  status: event.type,
                  reason: event.reason,
                  comment: event.comment,
                })),
              },
              issueChangeLogs: {
                create: issue.issueChangeLogEvents.map((event) => ({
                  providerEventId: event.providerEventId,
                  userEmitter:
                    event.userEmitterEmail != null
                      ? {
                          connect: {
                            email: event.userEmitterEmail,
                          },
                        }
                      : undefined,
                  eventRegisteredAt: event.createdAt,
                  from: event.from?.toString(),
                  to: event.to?.toString(),
                  field: event.field,
                })),
              },
            },
          });
        }

        return newProject;
      },
      {
        timeout: 100000,
      }
    );
    Logger.timeEnd('Project Integration TX');
    return new ProjectDTO(newProject);
  }
}
