import { mock, type MockProxy } from 'jest-mock-extended';
import { type IssueRepository } from '@domains/issue/repository';
import { type EventRepository } from '@domains/event/repository';
import { type UserRepository } from '@domains/user';
import { type ProjectRepository } from '@domains/project/repository';

export const issueRepositoryMock: MockProxy<IssueRepository> = mock<IssueRepository>();
export const eventRepositoryMock: MockProxy<EventRepository> = mock<EventRepository>();
export const userRepositoryMock: MockProxy<UserRepository> = mock<UserRepository>();
export const projectRepositoryMock: MockProxy<ProjectRepository> = mock<ProjectRepository>();
