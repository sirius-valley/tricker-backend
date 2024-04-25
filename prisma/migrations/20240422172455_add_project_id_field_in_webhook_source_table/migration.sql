/*
  Warnings:

  - Added the required column `projectId` to the `WebhookSource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WebhookSource" ADD COLUMN     "projectId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "WebhookSource" ADD CONSTRAINT "WebhookSource_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
