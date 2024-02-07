-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('NO_STATUS', 'BLOCKED_BY', 'BLOCKING_TO');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('NO_PRIORITY', 'LOW_PRIORITY', 'MEDIUM_PRIORITY', 'HIGH_PRIORITY', 'URGENT');

-- CreateEnum
CREATE TYPE "AuthorizationStatus" AS ENUM ('ACCEPTED', 'PENDING');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingUser" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "projectId" UUID NOT NULL,
    "status" "AuthorizationStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PendingUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "authorId" UUID NOT NULL,
    "assigneeId" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "stageId" UUID NOT NULL,
    "issueLabelId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "storyPoints" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueCustomFields" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "issueId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "IssueCustomFields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stage" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogWebhooks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "statusId" UUID NOT NULL,
    "sourceId" UUID NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogWebhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookOutcomeStatus" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "WebhookOutcomeStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookSource" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "WebhookSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeTracking" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "issueId" UUID NOT NULL,
    "startTime" DOUBLE PRECISION NOT NULL,
    "endTime" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TimeTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProjectRole" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "userEmitterId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UserProjectRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueLabel" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "IssueLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockerStatusModification" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userEmitterId" UUID NOT NULL,
    "issueId" UUID NOT NULL,
    "status" "BlockType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "BlockerStatusModification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManualTimeModification" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userEmitterId" UUID NOT NULL,
    "issueId" UUID NOT NULL,
    "timeAmount" INTEGER NOT NULL,
    "modificationDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "ManualTimeModification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueChangeLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userEmitterId" UUID NOT NULL,
    "issueId" UUID NOT NULL,
    "field" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IssueChangeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectStage" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "stageId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProjectStage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PendingUser" ADD CONSTRAINT "PendingUser_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_issueLabelId_fkey" FOREIGN KEY ("issueLabelId") REFERENCES "IssueLabel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueCustomFields" ADD CONSTRAINT "IssueCustomFields_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogWebhooks" ADD CONSTRAINT "LogWebhooks_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "WebhookOutcomeStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogWebhooks" ADD CONSTRAINT "LogWebhooks_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "WebhookSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeTracking" ADD CONSTRAINT "TimeTracking_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjectRole" ADD CONSTRAINT "UserProjectRole_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjectRole" ADD CONSTRAINT "UserProjectRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjectRole" ADD CONSTRAINT "UserProjectRole_userEmitterId_fkey" FOREIGN KEY ("userEmitterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjectRole" ADD CONSTRAINT "UserProjectRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockerStatusModification" ADD CONSTRAINT "BlockerStatusModification_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockerStatusModification" ADD CONSTRAINT "BlockerStatusModification_userEmitterId_fkey" FOREIGN KEY ("userEmitterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualTimeModification" ADD CONSTRAINT "ManualTimeModification_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualTimeModification" ADD CONSTRAINT "ManualTimeModification_userEmitterId_fkey" FOREIGN KEY ("userEmitterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueChangeLog" ADD CONSTRAINT "IssueChangeLog_userEmitterId_fkey" FOREIGN KEY ("userEmitterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueChangeLog" ADD CONSTRAINT "IssueChangeLog_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStage" ADD CONSTRAINT "ProjectStage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStage" ADD CONSTRAINT "ProjectStage_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
