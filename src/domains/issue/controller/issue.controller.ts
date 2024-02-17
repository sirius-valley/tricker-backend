import { type Request, type Response, Router } from 'express';

require('express-async-errors');

export const issueRouter = Router();

issueRouter.post('/integrate/linear', async (req: Request, res: Response) => {
  /* const { userId } = res.locals.context;
  const { projectId } = req.body; */
});
