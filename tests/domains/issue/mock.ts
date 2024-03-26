import { mock, type MockProxy } from 'jest-mock-extended';
import { type IssueRepository } from '@domains/issue/repository';
import { type EventRepository } from '@domains/event/repository';
import { type UserRepository } from '@domains/user';
import { type ProjectRepository } from '@domains/project/repository';
import { type UserProjectRoleRepository } from '@domains/userProjectRole/repository';
import { type RoleRepository } from '@domains/role/repository';
import { type ProjectStageRepository } from '@domains/projectStage/repository';

export const issueRepositoryMock: MockProxy<IssueRepository> = mock<IssueRepository>();
export const eventRepositoryMock: MockProxy<EventRepository> = mock<EventRepository>();
export const userRepositoryMock: MockProxy<UserRepository> = mock<UserRepository>();
export const projectRepositoryMock: MockProxy<ProjectRepository> = mock<ProjectRepository>();
export const userProjectRoleRepositoryMock: MockProxy<UserProjectRoleRepository> = mock<UserProjectRoleRepository>();
export const roleRepositoryMock: MockProxy<RoleRepository> = mock<RoleRepository>();
export const projectStageRepositoryMock: MockProxy<ProjectStageRepository> = mock<ProjectStageRepository>();
