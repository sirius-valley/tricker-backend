import { type IssueDTO } from '@domains/issue/dto';
import { type ManualTimeModificationDTO, type TimeTrackingDTO } from '@domains/event/dto';

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

export const stoppedMockTimeTrackingDTO: TimeTrackingDTO = {
  issueId: 'issue789',
  startTime: new Date('2024-03-12T09:00:00Z'),
  id: 'b09f23b5-7e1d-4e50-bd33-cac9cc53fccd',
  endTime: new Date('2024-03-12T10:00:00Z'),
};

export const validMockManualTimeModification: ManualTimeModificationDTO = {
  id: '2bdcfe9c-80ff-43af-9f4d-438019c94e4d',
  userEmitterId: 'd27608ce-bf6c-4806-8e98-200e6c2cb29a',
  issueId: 'issue789',
  timeAmount: 10,
  modificationDate: new Date(),
  reason: 'modification for tests only',
};

export const negativeMockManualTimeModification: ManualTimeModificationDTO = {
  id: '2bdcfe9c-80ff-43af-9f4d-438019c94e4d',
  userEmitterId: 'd27608ce-bf6c-4806-8e98-200e6c2cb29a',
  issueId: 'issue789',
  timeAmount: -7300,
  modificationDate: new Date(),
  reason: 'modification for tests only',
};
