/*
  Warnings:

  - You are about to drop the column `logo` on the `Shop` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "logo";

-- CreateTable
CREATE TABLE "_ProductImgToShop" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductImgToShop_AB_unique" ON "_ProductImgToShop"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductImgToShop_B_index" ON "_ProductImgToShop"("B");

-- AddForeignKey
ALTER TABLE "_ProductImgToShop" ADD CONSTRAINT "_ProductImgToShop_A_fkey" FOREIGN KEY ("A") REFERENCES "ProductImg"("imgId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductImgToShop" ADD CONSTRAINT "_ProductImgToShop_B_fkey" FOREIGN KEY ("B") REFERENCES "Shop"("shopId") ON DELETE CASCADE ON UPDATE CASCADE;
