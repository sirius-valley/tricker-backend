import { userRouter } from '@domains/user/controller';
import { withAwsAuth } from '@utils/auth';
import { Router } from 'express';
import { projectRouter } from '@domains/project/controller/project.controller';
import { issueRouter } from '@domains/issue/controller';

export const router = Router();

router.use('/user', withAwsAuth, userRouter);
router.use('/project', withAwsAuth, projectRouter);
router.use('/issue', withAwsAuth, issueRouter);
