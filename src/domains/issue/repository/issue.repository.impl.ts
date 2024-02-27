import { type IssueRepository } from '@domains/issue/repository/issue.repository';
import { type CreateIssueDTO, IssueDTO } from '@domains/issue/dto';
import { type Issue, type PrismaClient } from '@prisma/client';

export class IssueRepositoryImpl implements IssueRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(data: CreateIssueDTO): Promise<IssueDTO> {
    const issue: Issue = await this.db.issue.create({
      data: {
        providerIssueId: data.providerIssueId,
        authorId: data.authorId,
        assigneeId: data.assigneeId,
        projectId: data.projectId,
        stageId: data.stageId,
        issueLabelId: data.issueLabelId,
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
