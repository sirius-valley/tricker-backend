import type { IssueViewDTO } from '@domains/issue';
import { StageType } from '@prisma/client';
import { type DevProjectFiltersDTO, type PMProjectFiltersDTO } from '@domains/project/dto';

export const mockIssueViewDTO1: IssueViewDTO = {
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
    position: 1,
    color: '#FF0000',
  },
  name: 'TRI-001',
  title: 'Fake issue',
  description: 'Fake issue description',
  priority: 'MEDIUM_PRIORITY',
  storyPoints: 1,
  isBlocked: false,
  labels: [],
  isTracking: false,
};

export const mockIssueViewDTO2: IssueViewDTO = {
  id: 'issue790',
  assignee: {
    id: 'user123',
    name: 'John Doe',
    profileUrl: null,
  },
  stage: {
    id: 'stage457',
    name: 'In progress',
    type: StageType.STARTED,
    position: 2,
    color: '#FF0000',
  },
  name: 'TRI-001',
  title: 'Fake issue',
  description: 'Fake issue description',
  priority: 'MEDIUM_PRIORITY',
  storyPoints: 1,
  isBlocked: false,
  labels: [],
  isTracking: false,
};

export const mockIssueViewDTO3: IssueViewDTO = {
  id: 'issue791',
  assignee: {
    id: 'user124',
    name: 'Bruce Wayne',
    profileUrl: null,
  },
  stage: {
    id: 'stage456',
    name: 'TODO',
    type: StageType.UNSTARTED,
    position: 3,
    color: '#FF0000',
  },
  name: 'TRI-001',
  title: 'Fake issue',
  description: 'Fake issue description',
  priority: 'LOW_PRIORITY',
  storyPoints: 4,
  isBlocked: false,
  labels: [],
  isTracking: false,
};

export const mockDevProjectFilterDTO: DevProjectFiltersDTO = {
  stages: [
    {
      id: 'stage456',
      name: 'TODO',
      type: StageType.UNSTARTED,
      color: '#FF0000',
    },
    {
      id: 'stage457',
      name: 'In progress',
      type: StageType.STARTED,
      color: '#FF0000',
    },
  ],
  priorities: ['Medium Priority'],
};

export const mockPMProjectFilterDTO: PMProjectFiltersDTO = {
  stages: [
    {
      id: 'stage456',
      name: 'TODO',
      type: StageType.UNSTARTED,
      color: '#FF0000',
    },
    {
      id: 'stage457',
      name: 'In progress',
      type: StageType.STARTED,
      color: '#FF0000',
    },
  ],
  priorities: ['Low Priority', 'Medium Priority'],
  assignees: [
    {
      id: 'user124',
      name: 'Bruce Wayne',
    },
    {
      id: 'user123',
      name: 'John Doe',
    },
  ],
};
