import { type IssueRepository } from '@domains/issue/repository/issue.repository';
import { type IssueInput, IssueDTO } from '@domains/issue/dto';
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
}
