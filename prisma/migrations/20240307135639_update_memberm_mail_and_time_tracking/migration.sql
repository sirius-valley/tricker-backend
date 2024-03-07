/*
  Warnings:

  - A unique constraint covering the columns `[pendingProjectAuthorizationId,email]` on the table `MemberEmail` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `startTime` on the `TimeTracking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endTime` on the `TimeTracking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "MemberEmail_email_key";

-- AlterTable
ALTER TABLE "TimeTracking" DROP COLUMN "startTime",
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MemberEmail_pendingProjectAuthorizationId_email_key" ON "MemberEmail"("pendingProjectAuthorizationId", "email");
