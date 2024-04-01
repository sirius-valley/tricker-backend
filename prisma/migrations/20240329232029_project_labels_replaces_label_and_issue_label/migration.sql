/*
  Warnings:

  - You are about to drop the column `labelId` on the `ProjectLabel` table. All the data in the column will be lost.
  - You are about to drop the `IssueLabel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Label` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[projectId,name]` on the table `ProjectLabel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `ProjectLabel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IssueLabel" DROP CONSTRAINT "IssueLabel_issueId_fkey";

-- DropForeignKey
ALTER TABLE "IssueLabel" DROP CONSTRAINT "IssueLabel_labelId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectLabel" DROP CONSTRAINT "ProjectLabel_labelId_fkey";

-- AlterTable
ALTER TABLE "ProjectLabel" DROP COLUMN "labelId",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "IssueLabel";

-- DropTable
DROP TABLE "Label";

-- CreateTable
CREATE TABLE "_IssueToProjectLabel" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_IssueToProjectLabel_AB_unique" ON "_IssueToProjectLabel"("A", "B");

-- CreateIndex
CREATE INDEX "_IssueToProjectLabel_B_index" ON "_IssueToProjectLabel"("B");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectLabel_projectId_name_key" ON "ProjectLabel"("projectId", "name");

-- AddForeignKey
ALTER TABLE "_IssueToProjectLabel" ADD CONSTRAINT "_IssueToProjectLabel_A_fkey" FOREIGN KEY ("A") REFERENCES "Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IssueToProjectLabel" ADD CONSTRAINT "_IssueToProjectLabel_B_fkey" FOREIGN KEY ("B") REFERENCES "ProjectLabel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
