/*
  Warnings:

  - Added the required column `issueProviderId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "issueProviderId" UUID NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "url" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_issueProviderId_fkey" FOREIGN KEY ("issueProviderId") REFERENCES "IssueProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
