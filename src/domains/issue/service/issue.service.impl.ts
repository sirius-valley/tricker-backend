import { type IssueService } from '@domains/issue/service/issue.service';
import { type IssueRepository } from '@domains/issue/repository';

export class IssueServiceImpl implements IssueService {
  constructor(private readonly issueRepository: IssueRepository) {}

  async pauseTimer(issueId: string): Promise<boolean> {
    return await Promise.resolve(false);
  }
}
