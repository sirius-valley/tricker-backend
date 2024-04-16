-- DropForeignKey
ALTER TABLE "MemberEmail" DROP CONSTRAINT "MemberEmail_pendingProjectAuthorizationId_fkey";

-- AlterTable
ALTER TABLE "MemberEmail" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PendingProjectAuthorization" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "token" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "MemberEmail" ADD CONSTRAINT "MemberEmail_pendingProjectAuthorizationId_fkey" FOREIGN KEY ("pendingProjectAuthorizationId") REFERENCES "PendingProjectAuthorization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
