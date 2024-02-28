import { type IssueService } from '@domains/issue/service/issue.service';
import { type IssueRepository } from '@domains/issue/repository';
import { type ProjectRepository } from '@domains/project/repository';
import { type IssueDataDTO, type IssueDTO } from '@domains/issue/dto';
import { db, NotFoundException } from '@utils';
import { type ProjectDTO } from '@domains/project/dto';
import type { ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { type UserDTO, type UserRepository } from '@domains/user';

export class IssueServiceImpl implements IssueService {
  constructor(
    private readonly adapter: ProjectManagementToolAdapter,
    private readonly issueRepository: IssueRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository
  ) {}

  async integrateProjectIssues(projectId: string): Promise<IssueDTO[]> {
    const project: ProjectDTO | null = await this.projectRepository.getById(projectId);
    if (project === null) {
      throw new NotFoundException('Project');
    }

    const allIssuesData: IssueDataDTO[] = await this.adapter.adaptAllProjectIssuesData(project.providerId);
    const filteredIssuesData: IssueDataDTO[] = await Promise.all(
      allIssuesData.filter(async (issueData) => {
        return (await this.issueRepository.getByProviderId(issueData.providerIssueId)) === null;
      })
    );
    const integratedIssues: IssueDTO[] = await db.$transaction(async () => {
      const finalIssues: IssueDTO[] = [];
      for (const issueData of filteredIssuesData) {
        const author: UserDTO | null = issueData.authorEmail !== null ? await this.userRepository.getByEmail(issueData.authorEmail) : null;
        const assignee: UserDTO | null = issueData.assigneeEmail !== null ? await this.userRepository.getByEmail(issueData.assigneeEmail) : null;
        const newIssue: IssueDTO = await this.issueRepository.create({
          providerIssueId: issueData.providerIssueId,
          authorId: author != null ? author.id : null,
          assigneeId: assignee != null ? assignee.id : null,
          projectId,
          stageId: issueData.stage,
          issueLabelId: null,
          name: issueData.name,
          title: issueData.title,
          description: issueData.description,
          priority: issueData.priority,
          storyPoints: issueData.storyPoints,
        });
        finalIssues.push(newIssue);
      }

      return finalIssues;
    });

    return integratedIssues;
  }
}
