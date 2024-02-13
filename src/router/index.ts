import { authRouter } from '@domains/auth/controller/auth.controller';
import { userRouter } from '@domains/user/controller';
import { withAuth } from '@utils/auth';
import { Router } from 'express';
import { projectRouter } from '@domains/project/controller/project.controller';

export const router = Router();

router.use('/user', withAuth, userRouter);
router.use('/auth', authRouter);
router.use('/project', withAuth, projectRouter);
