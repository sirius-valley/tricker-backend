/*
  Warnings:

  - A unique constraint covering the columns `[providerIssueId]` on the table `Issue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerIssueId` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_assigneeId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_issueLabelId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_stageId_fkey";

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "providerIssueId" TEXT NOT NULL,
ALTER COLUMN "authorId" DROP NOT NULL,
ALTER COLUMN "assigneeId" DROP NOT NULL,
ALTER COLUMN "stageId" DROP NOT NULL,
ALTER COLUMN "issueLabelId" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "storyPoints" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Issue_providerIssueId_key" ON "Issue"("providerIssueId");

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_issueLabelId_fkey" FOREIGN KEY ("issueLabelId") REFERENCES "IssueLabel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
