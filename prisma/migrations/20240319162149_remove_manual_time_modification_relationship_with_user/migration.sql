/*
  Warnings:

  - You are about to drop the column `userEmitterId` on the `ManualTimeModification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ManualTimeModification" DROP CONSTRAINT "ManualTimeModification_userEmitterId_fkey";

-- AlterTable
ALTER TABLE "ManualTimeModification" DROP COLUMN "userEmitterId";
