/*
  Warnings:

  - Added the required column `type` to the `ProjectStage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StageType" AS ENUM ('BACKLOG', 'UNSTARTED', 'STARTED', 'COMPLETED', 'CANCELED', 'OTHER');

-- AlterTable
ALTER TABLE "ProjectStage" ADD COLUMN     "type" "StageType" NOT NULL;
