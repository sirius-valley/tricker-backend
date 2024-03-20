/*
  Warnings:

  - A unique constraint covering the columns `[stageId,projectId]` on the table `ProjectStage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProjectStage_stageId_projectId_key" ON "ProjectStage"("stageId", "projectId");
