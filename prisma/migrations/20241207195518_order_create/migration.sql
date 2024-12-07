/*
  Warnings:

  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `logoImgPath` on table `Shop` required. This step will fail if there are existing NULL values in that column.
  - Made the column `logoImgSize` on table `Shop` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "userId",
ADD COLUMN     "customerId" UUID NOT NULL,
ADD COLUMN     "discountSave" DOUBLE PRECISION,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Shop" ALTER COLUMN "logoImgPath" SET NOT NULL,
ALTER COLUMN "logoImgSize" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
