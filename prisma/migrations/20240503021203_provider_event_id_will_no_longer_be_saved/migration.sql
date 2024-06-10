/*
  Warnings:

  - You are about to drop the column `providerEventId` on the `LogWebhooks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LogWebhooks" DROP COLUMN "providerEventId";
