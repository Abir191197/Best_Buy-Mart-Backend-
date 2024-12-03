/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "profileImg" DROP NOT NULL,
ALTER COLUMN "profileImg" DROP DEFAULT,
ALTER COLUMN "profileImg" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
