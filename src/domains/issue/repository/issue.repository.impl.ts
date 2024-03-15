import { type IssueRepository } from '@domains/issue/repository/issue.repository';
import { type IssueInput, IssueDTO, type IssueFilterParameters, IssueViewDTO } from '@domains/issue/dto';
import { type Issue, type PrismaClient } from '@prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';

export class IssueRepositoryImpl implements IssueRepository {
  constructor(private readonly db: PrismaClient | Omit<PrismaClient, ITXClientDenyList>) {}

  async create(data: IssueInput): Promise<IssueDTO> {
    const issue: Issue = await this.db.issue.create({
      data: {
        providerIssueId: data.providerIssueId,
        authorId: data.authorId,
        assigneeId: data.assigneeId,
        projectId: data.projectId,
        stageId: data.stageId,
        name: data.name,
        title: data.title,
        description: data.description,
        priority: data.priority,
        storyPoints: data.storyPoints,
      },
    });

    return new IssueDTO(issue);
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

  async getWithFilters(filters: IssueFilterParameters): Promise<IssueViewDTO[]> {
    const issues = await this.db.issue.findMany({
      cursor: filters.cursor !== undefined ? { id: filters.cursor } : undefined,
      take: 20,
      where: {
        projectId: filters.projectId,
        assigneeId: { in: filters.assigneeIds },
        stageId: { in: filters.stageIds },
        storyPoints: { not: null },
        priority: { in: filters.priorities },
      },
      include: {
        assignee: true,
        labels: true,
        stage: {
          include: {
            projectStages: {
              where: {
                projectId: filters.projectId,
              },
            },
          },
        },
      },
    });

    return issues.map((issue) => {
      return new IssueViewDTO({
        id: issue.id,
        assigneeName: issue.assignee != null ? issue.assignee.name : null,
        assigneeProfileUrl: issue.assignee !== null ? issue.assignee.profileImage : null,
        stageId: issue.stageId,
        name: issue.name,
        title: issue.title,
        priority: issue.priority,
        storyPoints: issue.storyPoints,
        labelIds: issue.labels.map((label) => label.id),
        // type: issue.stage !== null?
        //    issue.stage.projectStages.find(projectStage => projectStage.projectId === filters.projectId)?.type
        //    : null,
      });
    });
  }
}
