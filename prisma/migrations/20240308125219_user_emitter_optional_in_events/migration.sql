-- DropForeignKey
ALTER TABLE "BlockerStatusModification" DROP CONSTRAINT "BlockerStatusModification_userEmitterId_fkey";

-- DropForeignKey
ALTER TABLE "IssueChangeLog" DROP CONSTRAINT "IssueChangeLog_userEmitterId_fkey";

-- AlterTable
ALTER TABLE "BlockerStatusModification" ALTER COLUMN "userEmitterId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "IssueChangeLog" ALTER COLUMN "userEmitterId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "BlockerStatusModification" ADD CONSTRAINT "BlockerStatusModification_userEmitterId_fkey" FOREIGN KEY ("userEmitterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueChangeLog" ADD CONSTRAINT "IssueChangeLog_userEmitterId_fkey" FOREIGN KEY ("userEmitterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
