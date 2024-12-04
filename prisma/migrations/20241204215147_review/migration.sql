/*
  Warnings:

  - You are about to drop the column `review` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `_ProductImgToShop` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "Shop_Status" ADD VALUE 'REVIEW_PENDING';

-- DropForeignKey
ALTER TABLE "_ProductImgToShop" DROP CONSTRAINT "_ProductImgToShop_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductImgToShop" DROP CONSTRAINT "_ProductImgToShop_B_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "review",
ADD COLUMN     "discountCode" INTEGER,
ADD COLUMN     "discountPercent" INTEGER;

-- DropTable
DROP TABLE "_ProductImgToShop";

-- CreateTable
CREATE TABLE "Review" (
    "reviewId" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "reviewText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,
    "productId" UUID NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("reviewId")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
