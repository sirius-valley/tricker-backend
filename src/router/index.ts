import { userRouter } from '@domains/user/controller';
import { withAwsAuth } from '@utils/auth';
import { Router } from 'express';

export const router = Router();

router.use('/user', withAwsAuth, userRouter);
