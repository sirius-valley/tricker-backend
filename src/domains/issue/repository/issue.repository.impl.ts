import { type IssueRepository } from '@domains/issue/repository/issue.repository';
import { type IssueInput, IssueDTO, IssueViewDTO, type PMIssueFilterParameters, type IssueAndIsBlocked, IssueDetailsDTO, type UserProject } from '@domains/issue/dto';
import { type Issue, type PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';
import { LabelDTO } from '@domains/label/dto';

export class IssueRepositoryImpl implements IssueRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  /**
   * Asynchronously creates an issue based on the provided input data.
   * @param data The input data for creating the issue.
   * @returns A Promise that resolves to an IssueDTO representing the created issue.
   */
  async create(data: IssueInput): Promise<IssueViewDTO> {
    const issue = await this.db.issue.create({
      data: {
        providerIssueId: data.providerIssueId,
        authorId: data.authorId,
        assigneeId: data.assigneeId,
        projectId: data.projectId,
        projectStageId: data.projectStageId,
        name: data.name,
        title: data.title,
        description: data.description,
        priority: data.priority,
        storyPoints: data.storyPoints,
      },
      include: {
        assignee: true,
        stage: true,
        labels: {
          include: {
            label: true,
          },
        },
      },
    });

    return new IssueViewDTO({
      id: issue.id,
      assignee: issue.assignee !== null ? { name: issue.assignee.name, id: issue.assigneeId!, profileUrl: issue.assignee.profileImage } : null,
      stage: issue.stage !== null ? { id: issue.stage.id, name: issue.stage.name, type: issue.stage.type } : null,
      name: issue.name,
      title: issue.title,
      description: issue.description,
      priority: issue.priority,
      storyPoints: issue.storyPoints,
      isBlocked: issue.isBlocked,
      labels: issue.labels.map((label) => new LabelDTO({ id: label.label.id, name: label.label.name })),
      isTracking: false,
    });
  }

  async getByProviderId(providerIssueId: string): Promise<IssueDTO | null> {
    const issue: Issue | null = await this.db.issue.findFirst({
      where: {
        providerIssueId,
      },
    });

    return issue === null ? null : new IssueDTO(issue);
  }

  async getById(id: string): Promise<IssueDTO | null> {
    const issue: Issue | null = await this.db.issue.findUnique({
      where: {
        id,
      },
    });

    return issue === null ? null : new IssueDTO(issue);
  }

  /**
   * Asynchronously retrieves issues based on the provided filters.
   * @param filters The parameters for filtering issues.
   * @returns A Promise that resolves to an array of IssueViewDTO objects representing the retrieved issues.
   */
  async getWithFilters(filters: PMIssueFilterParameters): Promise<IssueViewDTO[]> {
    const issues = await this.db.issue.findMany({
      cursor: filters.cursor !== undefined ? { id: filters.cursor } : undefined,
      take: 20,
      where: {
        projectId: filters.projectId,
        projectStageId: { in: filters.stageIds },
        assigneeId: filters.assigneeIds === undefined ? { not: null } : { in: filters.assigneeIds },
        storyPoints: filters.isOutOfEstimation === undefined ? {} : filters.isOutOfEstimation ? null : { not: null },
        priority: { in: filters.priorities },
      },
      include: {
        assignee: {
          where: {
            projectsRoleAssigned: {
              every: {
                isAccepted: true,
              },
            },
          },
        },
        labels: {
          include: {
            label: true,
          },
        },
        stage: true,
        timeTrackings: {
          where: {
            endTime: null,
          },
        },
      },
      orderBy: [
        {
          stage: {
            type: 'asc',
          },
        },
        {
          stage: {
            name: 'asc',
          },
        },
      ],
    });

    return issues.map((issue) => {
      return new IssueViewDTO({
        id: issue.id,
        assignee: issue.assignee !== null ? { name: issue.assignee.name, id: issue.assigneeId!, profileUrl: issue.assignee.profileImage } : null,
        stage: issue.stage !== null ? { id: issue.stage.id, name: issue.stage.name, type: issue.stage.type } : null,
        name: issue.name,
        title: issue.title,
        description: issue.description,
        priority: issue.priority,
        storyPoints: issue.storyPoints,
        isBlocked: issue.isBlocked,
        labels: issue.labels.map((label) => new LabelDTO({ id: label.label.id, name: label.label.name })),
        isTracking: issue.timeTrackings.length !== 0,
      });
    });
  }

  /**
   * Updates the "isBlocked" status of an issue.
   * @param input - An object containing the issue ID and the new "isBlocked" status.
   * @returns A Promise that resolves to an IssueDetailsDTO object representing the updated issue details.
   */
  async updateIsBlocked(input: IssueAndIsBlocked): Promise<IssueDetailsDTO> {
    const issue = await this.db.issue.update({
      where: {
        id: input.issueId,
      },
      data: {
        isBlocked: input.isBlocked,
      },
      include: {
        assignee: {
          where: {
            projectsRoleAssigned: {
              every: {
                isAccepted: true,
              },
            },
          },
        },
        labels: {
          include: {
            label: true,
          },
        },
      },
    });

    return new IssueDetailsDTO({
      id: issue.id,
      assignee: issue.assignee !== null ? { name: issue.assignee.name, id: issue.assigneeId!, profileUrl: issue.assignee.profileImage } : null,
      name: issue.name,
      title: issue.title,
      description: issue.description,
      priority: issue.priority,
      storyPoints: issue.storyPoints,
      isBlocked: issue.isBlocked,
      labels: issue.labels.map((label) => new LabelDTO({ id: label.label.id, name: label.label.name })),
    });
  }

  /**
   * Retrieves details of an issue by its unique identifier.
   * @param id The unique identifier of the issue.
   * @returns An issue details DTO if found, otherwise null.
   */
  async getIssueDetailsById(id: string): Promise<IssueDetailsDTO | null> {
    const issue = await this.db.issue.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        assignee: {
          where: {
            projectsRoleAssigned: {
              every: {
                isAccepted: true,
              },
            },
          },
        },
        labels: {
          include: {
            label: true,
          },
        },
      },
    });

    return issue === null
      ? null
      : new IssueDetailsDTO({
          id: issue.id,
          assignee: issue.assignee !== null ? { name: issue.assignee.name, id: issue.assigneeId!, profileUrl: issue.assignee.profileImage } : null,
          name: issue.name,
          title: issue.title,
          description: issue.description,
          priority: issue.priority,
          storyPoints: issue.storyPoints,
          isBlocked: issue.isBlocked,
          labels: issue.labels.map((label) => new LabelDTO({ id: label.label.id, name: label.label.name })),
        });
  }

  /**
   * Retrieves issues by project ID.
   * @param {string} projectId - The ID of the project.
   * @returns {Promise<IssueViewDTO[]>} The retrieved issues.
   */
  async getByProjectId(projectId: string): Promise<IssueViewDTO[]> {
    const issues = await this.db.issue.findMany({
      where: {
        projectId,
      },
      include: {
        assignee: {
          where: {
            projectsRoleAssigned: {
              every: {
                isAccepted: true,
              },
            },
          },
        },
        labels: {
          include: {
            label: true,
          },
        },
        stage: {
          where: {
            projectId,
          },
        },
        timeTrackings: {
          where: {
            endTime: null,
          },
        },
      },
    });

    return issues.map((issue) => {
      return new IssueViewDTO({
        id: issue.id,
        assignee: issue.assignee !== null ? { name: issue.assignee.name, id: issue.assigneeId!, profileUrl: issue.assignee.profileImage } : null,
        stage: issue.stage !== null ? { id: issue.stage.id, name: issue.stage.name, type: issue.stage.type } : null,
        name: issue.name,
        title: issue.title,
        description: issue.description,
        priority: issue.priority,
        storyPoints: issue.storyPoints,
        isBlocked: issue.isBlocked,
        labels: issue.labels.map((label) => new LabelDTO({ id: label.label.id, name: label.label.name })),
        isTracking: issue.timeTrackings.length !== 0,
      });
    });
  }

  /**
   * Retrieves issues by project ID and user ID.
   * @param {UserProject} input - The project and user IDs.
   * @returns {Promise<IssueViewDTO[]>} The retrieved issues.
   */
  async getByProjectIdAndUserId(input: UserProject): Promise<IssueViewDTO[]> {
    const issues = await this.db.issue.findMany({
      where: {
        projectId: input.projectId,
        assigneeId: input.userId,
      },
      include: {
        assignee: {
          where: {
            projectsRoleAssigned: {
              every: {
                isAccepted: true,
              },
            },
          },
        },
        labels: {
          include: {
            label: true,
          },
        },
        stage: {
          where: {
            projectId: input.projectId,
          },
        },
        timeTrackings: {
          where: {
            endTime: null,
          },
        },
      },
    });

    return issues.map((issue) => {
      return new IssueViewDTO({
        id: issue.id,
        assignee: issue.assignee !== null ? { name: issue.assignee.name, id: issue.assigneeId!, profileUrl: issue.assignee.profileImage } : null,
        stage: issue.stage !== null ? { id: issue.stage.id, name: issue.stage.name, type: issue.stage.type } : null,
        name: issue.name,
        title: issue.title,
        description: issue.description,
        priority: issue.priority,
        storyPoints: issue.storyPoints,
        isBlocked: issue.isBlocked,
        labels: issue.labels.map((label) => new LabelDTO({ id: label.label.id, name: label.label.name })),
        isTracking: issue.timeTrackings.length !== 0,
      });
    });
  }
}
