import { mock, type MockProxy } from 'jest-mock-extended';
import type { IssueRepository } from '@domains/issue';
import type { UserRepository } from '@domains/user';
import type { ProjectRepository } from '@domains/project/repository';

export const issueRepositoryMock: MockProxy<IssueRepository> = mock<IssueRepository>();
export const userRepositoryMock: MockProxy<UserRepository> = mock<UserRepository>();
export const projectRepositoryMock: MockProxy<ProjectRepository> = mock<ProjectRepository>();
