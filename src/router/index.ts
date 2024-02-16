import { userRouter } from '@domains/user/controller';
import { withAwsAuth } from '@utils/auth';
import { Router } from 'express';
import { projectRouter } from '@domains/project/controller/project.controller';

export const router = Router();

router.use('/user', withAwsAuth, userRouter);
router.use('/project', withAwsAuth, projectRouter);
