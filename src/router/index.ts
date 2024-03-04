import { userRouter } from '@domains/user/controller';
import { withAwsAuth } from '@utils/auth';
import { Router } from 'express';
import { issueRouter } from '@domains/issue/controller';
import { integrationRouter } from '@domains/integration/controller';

export const router = Router();

router.use('/user', withAwsAuth, userRouter);
router.use('/integration', integrationRouter);
router.use('/issue', withAwsAuth, issueRouter);
