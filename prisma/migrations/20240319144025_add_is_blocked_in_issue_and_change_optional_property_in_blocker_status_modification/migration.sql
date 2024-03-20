-- AlterTable
ALTER TABLE "BlockerStatusModification" ALTER COLUMN "providerEventId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false;
