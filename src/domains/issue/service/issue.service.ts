export interface IssueService {
  getIssueWorkedTime: (issueId: string) => Promise<number>;
}
