import { type IssueDetailsDTO, type IssueDTO, type IssueExtendedDTO, type IssueViewDTO, type ManualTimeModificationEventInput, type Priority } from '@domains/issue/dto';
import { type BlockerStatusModificationDTO, type IssueAddBlockerInput, type IssueChangeLogDTO, type ManualTimeModificationDTO, type TimeTrackingDTO } from '@domains/event/dto';
import { type UserDTO } from '@domains/user';
import { type ProjectDTO } from '@domains/project/dto';
import { StageType } from '@prisma/client';
import { type ProjectStageDTO } from '@domains/projectStage/dto';
import { type UserProjectRoleDTO } from '@domains/userProjectRole/dto';
import { type RoleDTO } from '@domains/role/dto';

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
  projectStageId: 'stage789',
  title: 'Sample Issue Title',
  isBlocked: false,
};

export const mockIssueDTOWithoutStage: IssueDTO = { ...mockIssueDTO, projectStageId: null };

export const mockProjectStageDTO: ProjectStageDTO = {
  id: 'd0725f8b-3823-4c6c-a2b8-9bd828f8b61c',
  projectId: '28b8f326-6a73-4f0e-b625-b1f54f900e0a',
  name: 'Todo',
  type: 'UNSTARTED',
  createdAt: new Date(),
  deletedAt: null,
};

export const mockProjectStageDTOStarted: ProjectStageDTO = { ...mockProjectStageDTO, name: 'In progress', type: 'STARTED' };

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
  issueId: 'issue789',
  timeAmount: 10,
  modificationDate: new Date(),
  reason: 'modification for tests only',
};

export const negativeMockManualTimeModification: ManualTimeModificationDTO = {
  id: '2bdcfe9c-80ff-43af-9f4d-438019c94e4d',
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

export const mockLogicallyDeletedUserDTO: UserDTO = {
  id: 'user123',
  cognitoId: 'cognito145',
  email: 'johnDoe@mail.com',
  name: 'John Doe',
  profileImage: null,
  projectsRoleAssigned: [],
  createdAt: new Date('2024-03-12T10:00:00Z'),
  deletedAt: new Date('2024-03-12T10:00:00Z'),
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
  description: 'Fake issue description',
  storyPoints: 1,
  isBlocked: false,
  labels: [],
  isTracking: false,
};

export const mockDevIssueFilterParameters = {
  userId: 'user124',
  projectId: 'Project777',
  stageIds: ['stage456'],
  priorities: ['MEDIUM_PRIORITY' as Priority],
  isOutOfEstimation: false,
  labelIds: undefined,
  cursor: undefined,
};

export const mockPMIssueFilterParameters = {
  userId: 'user123',
  projectId: 'Project777',
  stageIds: ['stage456'],
  priorities: ['MEDIUM_PRIORITY' as Priority],
  assigneeIds: ['user123'],
  isOutOfEstimation: false,
  labelIds: undefined,
  cursor: undefined,
};

export const mockUserProjectRoleDTO: UserProjectRoleDTO = {
  id: 'userProjectRole852',
  userId: 'user123',
  userEmitterId: 'user123',
  projectId: 'Project777',
  roleId: 'role333',
  createdAt: new Date('2024-03-12T09:00:00Z'),
  updatedAt: new Date('2024-03-12T09:00:00Z'),
  deletedAt: null,
};

export const mockPMRoleDTO: RoleDTO = {
  id: 'role888',
  name: 'Project Manager',
};

export const mockDevRoleDTO: RoleDTO = {
  id: 'role111',
  name: 'Developer',
};

export const mockAddManualTimeModificationEventInput: ManualTimeModificationEventInput = {
  issueId: 'ABC123',
  timeAmount: 3600, // Adding 1 hour (in seconds)
  reason: 'Meeting with client',
  date: new Date('2024-03-19T12:00:00Z'),
};

export const mockRemoveManualTimeModificationEventInput: ManualTimeModificationEventInput = {
  issueId: 'ABC123',
  timeAmount: -3600, // Removing 1 hour (in seconds)
  reason: 'Meeting with client',
  date: new Date('2024-03-19T12:00:00Z'),
};

export const mockTrickerBlockEventDTO: BlockerStatusModificationDTO = {
  id: 'blockerEvent753',
  eventRegisteredAt: new Date('2024-03-12T09:00:00Z'),
  reason: 'Blocked by card TRI-01',
  comment: 'Waiting card TRI-01 to be finished',
  createdAt: new Date('2024-03-12T09:01:00Z'),
  status: 'BLOCKED_BY',
  issueId: 'issue789',
  providerEventId: null,
  userEmitterId: 'user123',
};

export const mockTrickerUnBlockEventDTO: BlockerStatusModificationDTO = {
  id: 'blockerEvent753',
  eventRegisteredAt: new Date('2024-03-12T09:00:00Z'),
  reason: 'Unblocked by user John Doe',
  comment: 'Issue TRI-120 unblocked.',
  createdAt: new Date('2024-03-12T09:00:00Z'),
  status: 'BLOCKED_BY',
  issueId: 'issue789',
  providerEventId: null,
  userEmitterId: 'user123',
};

export const mockIssueDetailsDTO: IssueDetailsDTO = {
  description: 'This is a sample issue description.',
  id: 'issue789',
  storyPoints: 5,
  name: 'Sample Issue',
  priority: 'NO_PRIORITY',
  title: 'Sample Issue Title',
  assignee: {
    id: 'user123',
    name: 'John Doe',
    profileUrl: null,
  },
  labels: [{ id: 'label999', name: 'Backend' }],
  isBlocked: true,
};

export const mockIssueAddBlockerInput: IssueAddBlockerInput = {
  issueId: 'issue789',
  userCognitoId: 'cognito145',
  providerEventId: null,
  reason: 'Blocked by card TRI-01',
  comment: 'Waiting card TRI-01 to be finished',
};

export const mockIssueChangeLogDTO: IssueChangeLogDTO = {
  id: 'issueChangeLog887',
  createdAt: new Date('2024-03-11T09:00:00Z'),
  eventRegisteredAt: new Date('2024-03-11T09:00:00Z'),
  issueId: 'issue789',
  providerEventId: '',
  userEmitterId: 'user123',
  field: 'state',
  from: undefined,
  to: 'TODO',
};

export const mockAssigneeIssueChangeLogDTO: IssueChangeLogDTO = {
  id: 'issueChangeLog888',
  createdAt: new Date('2024-03-14T09:00:00Z'),
  eventRegisteredAt: new Date('2024-03-14T09:00:00Z'),
  issueId: 'issue789',
  providerEventId: '',
  userEmitterId: 'user123',
  field: 'assignee',
  from: undefined,
  to: 'John Doe',
};

export const mockIssueExtendedDTO: IssueExtendedDTO = {
  description: 'This is a sample issue description.',
  id: 'issue789',
  storyPoints: 5,
  name: 'Sample Issue',
  priority: 'NO_PRIORITY',
  title: 'Sample Issue Title',
  assignee: {
    id: 'user123',
    name: 'John Doe',
    profileUrl: null,
  },
  labels: [{ id: 'label999', name: 'Backend' }],
  isBlocked: true,
  chronology: [
    {
      isBlocker: false,
      eventId: 'issueChangeLog887',
      date: new Date('2024-03-11T09:00:00Z'),
      comment: undefined,
      message: 'Issue stage has changed to TODO',
    },
    {
      isBlocker: false,
      eventId: 'b09f23b5-7e1d-4e50-bd33-cac9cc53fccd',
      date: new Date('2024-03-12T09:00:00Z'),
      comment: undefined,
      message: 'Time tracking has started',
    },
    {
      isBlocker: true,
      eventId: 'blockerEvent753',
      date: new Date('2024-03-12T09:01:00Z'),
      comment: 'Issue TRI-120 unblocked.',
      message: 'Unblocked by user John Doe',
    },
    {
      isBlocker: false,
      eventId: 'b09f23b5-7e1d-4e50-bd33-cac9cc53fccd',
      date: new Date('2024-03-12T10:00:00Z'),
      comment: undefined,
      message: 'Time tracking has started',
    },
    {
      isBlocker: false,
      eventId: '2bdcfe9c-80ff-43af-9f4d-438019c94e4d',
      date: new Date('2024-03-13T09:00:00Z'),
      comment: undefined,
      message: 'modification for tests only',
    },
    {
      isBlocker: false,
      eventId: 'issueChangeLog888',
      date: new Date('2024-03-14T09:00:00Z'),
      comment: undefined,
      message: 'Issue has been assigned to John Doe',
    },
  ],
};
