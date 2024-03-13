export interface IssueService {
  getIssueWorkedSeconds: (issueId: string) => Promise<number>;
}
