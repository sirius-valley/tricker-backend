import { type Request, type Response, Router } from 'express';
import { IssueServiceImpl } from '@domains/issue/service';
import { type IssueRepository, IssueRepositoryImpl } from '@domains/issue/repository';
import { db } from '@utils';
import { type ProjectRepository, ProjectRepositoryImpl } from '@domains/project/repository';
import { UserRepositoryImpl } from '@domains/user';
import { type ProjectManagementToolAdapter } from '@domains/adapter/projectManagementToolAdapter';
import { LinearAdapter } from '@domains/adapter/linear/linear.adapter';
import HttpStatus from 'http-status';
import { type IssueDTO } from '@domains/issue/dto';

require('express-async-errors');

export const issueRouter = Router();
const issueRepository: IssueRepository = new IssueRepositoryImpl(db);
const projectRepository: ProjectRepository = new ProjectRepositoryImpl(db);
const userRepository: UserRepositoryImpl = new UserRepositoryImpl(db);
const adapter: ProjectManagementToolAdapter = new LinearAdapter();
const issueService: IssueServiceImpl = new IssueServiceImpl(adapter, issueRepository, projectRepository, userRepository);

issueRouter.post('/integrate/linear', async (req: Request, res: Response) => {
  const { projectId } = req.body;

  const issues: IssueDTO[] = await issueService.integrateProjectIssues(projectId as string);

  res.status(HttpStatus.CREATED).json(issues);
});
