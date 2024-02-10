import { authRouter } from '@domains/auth/controller/auth.controller.login';
import { userRouter } from '@domains/user/controller';
import { withAuth } from '@utils/auth';
import { Router } from 'express';

export const router = Router();

router.use('/user', withAuth, userRouter);
router.use('/auth', authRouter);
