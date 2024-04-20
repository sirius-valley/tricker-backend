import { userRouter } from '@domains/user/controller';
import { withAwsAuth } from '@utils/auth';
import { Router } from 'express';
import { integrationRouter } from '@domains/integration/controller';
import { issueRouter } from '@domains/issue/controller/issue.controller';
import { projectRouter } from '@domains/project/controller';
import { issueProviderRouter } from '@domains/issueProvider/controller/issueProvider.controller';
import { roleRouter } from '@domains/role/controller/role.controller';
import { Constants, NodeEnv } from '@utils';
import { ngrokHealthRouter } from '@domains/health/ngrokHealth/ngrokHealth.controller';

export const router = Router();

router.use('/user', withAwsAuth, userRouter);
router.use('/integration', withAwsAuth, integrationRouter);
router.use('/issue', withAwsAuth, issueRouter);
router.use('/projects', withAwsAuth, projectRouter);
router.use('/roles', withAwsAuth, roleRouter);
router.use('/issue-providers', withAwsAuth, issueProviderRouter);

if (Constants.NODE_ENV === NodeEnv.DEV) {
  router.use('/ngrok', ngrokHealthRouter);
}
