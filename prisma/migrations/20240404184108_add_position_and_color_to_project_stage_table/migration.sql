/*
  Warnings:

  - Added the required column `position` to the `ProjectStage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectStage" ADD COLUMN     "color" TEXT,
ADD COLUMN     "position" DOUBLE PRECISION NOT NULL;
