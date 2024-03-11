export interface IssueService {
  pauseTimer: (issueId: string) => Promise<boolean>;
}
