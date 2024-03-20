import { type IssueDTO, type IssueViewDTO, type Priority } from '@domains/issue/dto';
import { type ManualTimeModificationDTO, type TimeTrackingDTO } from '@domains/event/dto';
import { type UserDTO } from '@domains/user';
import { type ProjectDTO } from '@domains/project/dto';
import { StageType } from '@prisma/client';
import { type ProjectStageDTO } from '@domains/projectStage/dto';

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

export const mockIssueDTOWithoutStage: IssueDTO = { ...mockIssueDTO, stageId: null };

export const mockProjectStageDTO: ProjectStageDTO = {
  id: 'd0725f8b-3823-4c6c-a2b8-9bd828f8b61c',
  projectId: '28b8f326-6a73-4f0e-b625-b1f54f900e0a',
  stageId: '83e8df95-7e75-4dde-aea1-280e144ada0e',
  type: 'UNSTARTED',
  createdAt: new Date(),
  deletedAt: null,
};

export const mockProjectStageDTOStarted: ProjectStageDTO = { ...mockProjectStageDTO, type: 'STARTED' };

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

export const mockUserDTO: UserDTO = {
  id: 'user123',
  cognitoId: 'cognito145',
  email: 'johnDoe@mail.com',
  name: 'John Doe',
  profileImage: null,
  projectsRoleAssigned: [],
  createdAt: new Date('2024-03-12T10:00:00Z'),
  deletedAt: null,
  emittedUserProjectRole: [],
};

export const mockNotRegisteredUserDTO: UserDTO = {
  id: 'wrongId',
  cognitoId: null,
  email: 'johnDoe@mail.com',
  name: 'John Doe',
  profileImage: null,
  projectsRoleAssigned: [],
  createdAt: new Date('2024-03-12T10:00:00Z'),
  deletedAt: null,
  emittedUserProjectRole: [],
};

export const mockProjectDTO: ProjectDTO = {
  id: 'Project777',
  name: 'Tricker',
  providerId: 'IdLinear1',
  organizationId: 'IdSirius1',
  image: null,
  createdAt: new Date('2024-03-12T09:00:00Z'),
  deletedAt: null,
};

export const mockIssueViewDTO: IssueViewDTO = {
  id: 'issue789',
  assignee: {
    id: 'user123',
    name: 'John Doe',
    profileUrl: null,
  },
  stage: {
    id: 'stage456',
    name: 'TODO',
    type: StageType.UNSTARTED,
  },
  name: 'TRI-001',
  title: 'Fake issue',
  priority: 'MEDIUM_PRIORITY',
  storyPoints: 1,
  labels: [],
};

export const mockIssueFilterParameters = {
  userId: 'user123',
  projectId: 'Project777',
  stageIds: ['stage456'],
  priorities: ['MEDIUM_PRIORITY' as Priority],
  assigneeIds: ['user123'],
  isOutOfEstimation: false,
  labelIds: undefined,
  cursor: undefined,
};
