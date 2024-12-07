/*
  Warnings:

  - You are about to drop the `Logo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Logo" DROP CONSTRAINT "Logo_shopId_fkey";

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "logoImgPath" TEXT,
ADD COLUMN     "logoImgSize" INTEGER;

-- DropTable
DROP TABLE "Logo";
