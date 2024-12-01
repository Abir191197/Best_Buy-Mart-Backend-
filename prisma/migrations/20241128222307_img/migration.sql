-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phone" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ProductImg" (
    "imgId" UUID NOT NULL,
    "imgPath" TEXT NOT NULL,
    "imgSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" UUID NOT NULL,

    CONSTRAINT "ProductImg_pkey" PRIMARY KEY ("imgId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductImg_productId_key" ON "ProductImg"("productId");

-- AddForeignKey
ALTER TABLE "ProductImg" ADD CONSTRAINT "ProductImg_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
