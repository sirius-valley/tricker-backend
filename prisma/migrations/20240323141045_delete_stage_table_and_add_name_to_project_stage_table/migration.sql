/*
  Warnings:

  - You are about to drop the column `stageId` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `stageId` on the `ProjectStage` table. All the data in the column will be lost.
  - You are about to drop the `Stage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[projectId,name]` on the table `ProjectStage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `ProjectStage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_stageId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectStage" DROP CONSTRAINT "ProjectStage_stageId_fkey";

-- DropIndex
DROP INDEX "ProjectStage_stageId_projectId_key";

-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "stageId",
ADD COLUMN     "projectStageId" UUID;

-- AlterTable
ALTER TABLE "ProjectStage" DROP COLUMN "stageId",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "Stage";

-- CreateIndex
CREATE UNIQUE INDEX "ProjectStage_projectId_name_key" ON "ProjectStage"("projectId", "name");

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_projectStageId_fkey" FOREIGN KEY ("projectStageId") REFERENCES "ProjectStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
