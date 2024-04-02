/*
  Warnings:

  - You are about to drop the column `issueId` on the `BlockerStatusModification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[blockedIssueId,blockingIssueId]` on the table `BlockerStatusModification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `blockedIssueId` to the `BlockerStatusModification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BlockerStatusModification" DROP CONSTRAINT "BlockerStatusModification_issueId_fkey";

-- AlterTable
ALTER TABLE "BlockerStatusModification" DROP COLUMN "issueId",
ADD COLUMN     "blockedIssueId" UUID NOT NULL,
ADD COLUMN     "blockingIssueId" UUID,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "BlockerStatusModification_blockedIssueId_blockingIssueId_key" ON "BlockerStatusModification"("blockedIssueId", "blockingIssueId");

-- AddForeignKey
ALTER TABLE "BlockerStatusModification" ADD CONSTRAINT "BlockerStatusModification_blockedIssueId_fkey" FOREIGN KEY ("blockedIssueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockerStatusModification" ADD CONSTRAINT "BlockerStatusModification_blockingIssueId_fkey" FOREIGN KEY ("blockingIssueId") REFERENCES "Issue"("id") ON DELETE SET NULL ON UPDATE CASCADE;
