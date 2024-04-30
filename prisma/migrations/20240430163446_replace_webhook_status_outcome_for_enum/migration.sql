/*
  Warnings:

  - You are about to drop the column `statusId` on the `LogWebhooks` table. All the data in the column will be lost.
  - You are about to drop the `WebhookOutcomeStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WebhookStatus" AS ENUM ('PENDING', 'PROCESSED', 'ERROR');

-- DropForeignKey
ALTER TABLE "LogWebhooks" DROP CONSTRAINT "LogWebhooks_statusId_fkey";

-- AlterTable
ALTER TABLE "LogWebhooks" DROP COLUMN "statusId",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "status" "WebhookStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "WebhookOutcomeStatus";
