import { mock, type MockProxy } from 'jest-mock-extended';
import { type IssueRepository } from '@domains/issue/repository';
import { type EventRepository } from '@domains/event/repository';

export const issueRepositoryMock: MockProxy<IssueRepository> = mock<IssueRepository>();
export const eventRepositoryMock: MockProxy<EventRepository> = mock<EventRepository>();
