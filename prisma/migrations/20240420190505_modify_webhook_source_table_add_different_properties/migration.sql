/*
  Warnings:

  - You are about to drop the column `name` on the `WebhookSource` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerWebhookId]` on the table `WebhookSource` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `issueProviderId` to the `WebhookSource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WebhookSource" DROP COLUMN "name",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "issueProviderId" UUID NOT NULL,
ADD COLUMN     "providerWebhookId" TEXT,
ADD COLUMN     "secret" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "WebhookSource_providerWebhookId_key" ON "WebhookSource"("providerWebhookId");

-- AddForeignKey
ALTER TABLE "WebhookSource" ADD CONSTRAINT "WebhookSource_issueProviderId_fkey" FOREIGN KEY ("issueProviderId") REFERENCES "IssueProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
