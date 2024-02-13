-- AlterTable
ALTER TABLE "PendingUser" ALTER COLUMN "statusUpdatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserProjectRole" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
