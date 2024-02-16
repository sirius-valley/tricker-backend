/*
  Warnings:

  - A unique constraint covering the columns `[providerEventId]` on the table `LogWebhooks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[providerId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cognitoId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "image" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LogWebhooks_providerEventId_key" ON "LogWebhooks"("providerEventId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_providerId_key" ON "Project"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_cognitoId_key" ON "User"("cognitoId");
