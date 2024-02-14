/*
  Warnings:

  - You are about to drop the column `url` on the `Project` table. All the data in the column will be lost.
  - Added the required column `providerEventId` to the `LogWebhooks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cognitoId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LogWebhooks" ADD COLUMN     "providerEventId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PendingUser" ALTER COLUMN "statusUpdatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "url",
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "providerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cognitoId" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserProjectRole" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
