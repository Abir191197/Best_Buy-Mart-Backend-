/*
  Warnings:

  - Changed the type of `imgSize` on the `Logo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Logo" DROP COLUMN "imgSize",
ADD COLUMN     "imgSize" INTEGER NOT NULL;
