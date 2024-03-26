import { userRouter } from '@domains/user/controller';
import { withAwsAuth } from '@utils/auth';
import { Router } from 'express';
import { integrationRouter } from '@domains/integration/controller';
import { issueRouter } from '@domains/issue/controller/issue.controller';
import { projectRouter } from '@domains/project/controller';

export const router = Router();

router.use('/user', withAwsAuth, userRouter);
router.use('/integration', integrationRouter);
router.use('/issue', withAwsAuth, issueRouter);
router.use('/projects', withAwsAuth, projectRouter);
