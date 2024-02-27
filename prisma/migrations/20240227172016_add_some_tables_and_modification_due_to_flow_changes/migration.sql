/*
  Warnings:

  - You are about to drop the column `issueLabelId` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `IssueLabel` table. All the data in the column will be lost.
  - The `cognitoId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `PendingUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[providerEventId]` on the table `BlockerStatusModification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[providerEventId]` on the table `IssueChangeLog` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerEventId` to the `BlockerStatusModification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerEventId` to the `IssueChangeLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issueId` to the `IssueLabel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `labelId` to the `IssueLabel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_issueLabelId_fkey";

-- DropForeignKey
ALTER TABLE "PendingUser" DROP CONSTRAINT "PendingUser_projectId_fkey";

-- AlterTable
ALTER TABLE "BlockerStatusModification" ADD COLUMN     "eventRegisteredAt" TIMESTAMP(3),
ADD COLUMN     "providerEventId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "issueLabelId";

-- AlterTable
ALTER TABLE "IssueChangeLog" ADD COLUMN     "eventRegisteredAt" TIMESTAMP(3),
ADD COLUMN     "providerEventId" TEXT NOT NULL,
ALTER COLUMN "from" DROP NOT NULL,
ALTER COLUMN "to" DROP NOT NULL;

-- AlterTable
ALTER TABLE "IssueLabel" DROP COLUMN "name",
ADD COLUMN     "issueId" UUID NOT NULL,
ADD COLUMN     "labelId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "organizationId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cognitoId",
ADD COLUMN     "cognitoId" UUID,
ALTER COLUMN "name" DROP NOT NULL;

-- DropTable
DROP TABLE "PendingUser";

-- DropEnum
DROP TYPE "AuthorizationStatus";

-- CreateTable
CREATE TABLE "Label" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectLabel" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "labelId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProjectLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationAdministrator" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "OrganizationAdministrator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingProjectAuthorization" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "providerProjectId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "integratorId" TEXT NOT NULL,
    "issueProviderId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,

    CONSTRAINT "PendingProjectAuthorization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueProvider" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "IssueProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberEmail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "pendingProjectAuthorizationId" UUID NOT NULL,

    CONSTRAINT "MemberEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "IssueProvider_name_key" ON "IssueProvider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MemberEmail_email_key" ON "MemberEmail"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BlockerStatusModification_providerEventId_key" ON "BlockerStatusModification"("providerEventId");

-- CreateIndex
CREATE UNIQUE INDEX "IssueChangeLog_providerEventId_key" ON "IssueChangeLog"("providerEventId");

-- CreateIndex
CREATE UNIQUE INDEX "User_cognitoId_key" ON "User"("cognitoId");

-- AddForeignKey
ALTER TABLE "IssueLabel" ADD CONSTRAINT "IssueLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueLabel" ADD CONSTRAINT "IssueLabel_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectLabel" ADD CONSTRAINT "ProjectLabel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectLabel" ADD CONSTRAINT "ProjectLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationAdministrator" ADD CONSTRAINT "OrganizationAdministrator_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationAdministrator" ADD CONSTRAINT "OrganizationAdministrator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingProjectAuthorization" ADD CONSTRAINT "PendingProjectAuthorization_issueProviderId_fkey" FOREIGN KEY ("issueProviderId") REFERENCES "IssueProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingProjectAuthorization" ADD CONSTRAINT "PendingProjectAuthorization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberEmail" ADD CONSTRAINT "MemberEmail_pendingProjectAuthorizationId_fkey" FOREIGN KEY ("pendingProjectAuthorizationId") REFERENCES "PendingProjectAuthorization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
