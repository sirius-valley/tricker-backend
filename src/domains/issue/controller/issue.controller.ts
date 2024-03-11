import { type Request, type Response, Router } from 'express';
import { IsDefined, IsString } from 'class-validator';
import { type IssueService, IssueServiceImpl } from '@domains/issue/service';
import { db } from '@utils';
import { type IssueRepository, IssueRepositoryImpl } from '@domains/issue/repository';
import HttpStatus from 'http-status';

export const issueRouter = Router();

// todo: document
class IssuePauseParams {
  @IsString()
  @IsDefined()
  readonly id!: string;
}

const issueRepo: IssueRepository = new IssueRepositoryImpl(db);
const issueService: IssueService = new IssueServiceImpl(issueRepo);

issueRouter.get('/:id/pause', async (_req: Request<IssuePauseParams>, res: Response) => {
  const { id: issueId } = _req.params;

  const paused = await issueService.pauseTimer(issueId);

  return res.status(HttpStatus.OK).json({ paused });
});
