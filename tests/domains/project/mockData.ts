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
  },
  name: 'TRI-001',
  title: 'Fake issue',
  description: 'Fake issue description',
  priority: 'MEDIUM_PRIORITY',
  storyPoints: 1,
  isBlocked: false,
  labels: [],
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
  },
  name: 'TRI-001',
  title: 'Fake issue',
  description: 'Fake issue description',
  priority: 'MEDIUM_PRIORITY',
  storyPoints: 1,
  isBlocked: false,
  labels: [],
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
  },
  name: 'TRI-001',
  title: 'Fake issue',
  description: 'Fake issue description',
  priority: 'LOW_PRIORITY',
  storyPoints: 4,
  isBlocked: false,
  labels: [],
};

export const mockDevProjectFilterDTO: DevProjectFiltersDTO = {
  stages: [
    {
      id: 'stage456',
      name: 'TODO',
      type: StageType.UNSTARTED,
    },
    {
      id: 'stage457',
      name: 'In progress',
      type: StageType.STARTED,
    },
  ],
  priorities: ['MEDIUM_PRIORITY'],
};

export const mockPMProjectFilterDTO: PMProjectFiltersDTO = {
  stages: [
    {
      id: 'stage456',
      name: 'TODO',
      type: StageType.UNSTARTED,
    },
    {
      id: 'stage457',
      name: 'In progress',
      type: StageType.STARTED,
    },
  ],
  priorities: ['MEDIUM_PRIORITY', 'LOW_PRIORITY'],
  assignees: [
    {
      id: 'user123',
      name: 'John Doe',
    },
    {
      id: 'user124',
      name: 'Bruce Wayne',
    },
  ],
};
