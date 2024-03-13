import { type IssueDTO } from '@domains/issue/dto';
import { type TimeTrackingDTO } from '@domains/event/dto';

export const mockIssueDTO: IssueDTO = {
  assigneeId: 'user123',
  authorId: 'user456',
  createdAt: new Date('2024-03-12T09:00:00Z'),
  description: 'This is a sample issue description.',
  id: 'issue789',
  storyPoints: 5,
  deletedAt: null,
  name: 'Sample Issue',
  priority: 'NO_PRIORITY',
  projectId: 'project123',
  providerIssueId: 'externalIssue456',
  stageId: 'stage789',
  title: 'Sample Issue Title',
};

export const invalidMockTimeTrackingDTO: TimeTrackingDTO = {
  issueId: 'issue789',
  startTime: new Date('2024-03-12T09:00:00Z'),
  id: 'tracking789',
  endTime: new Date('2024-03-12T12:00:00Z'),
};

export const validMockTimeTrackingDTO: TimeTrackingDTO = {
  issueId: 'issue789',
  id: 'tracking789',
  startTime: new Date('2024-03-12T09:00:00Z'),
  endTime: null,
};
