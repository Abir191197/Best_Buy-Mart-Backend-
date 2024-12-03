-- CreateTable
CREATE TABLE "Logo" (
    "logoId" UUID NOT NULL,
    "imgPath" TEXT NOT NULL,
    "imgSize" TEXT NOT NULL,
    "shopId" UUID NOT NULL,

    CONSTRAINT "Logo_pkey" PRIMARY KEY ("logoId")
);

-- AddForeignKey
ALTER TABLE "Logo" ADD CONSTRAINT "Logo_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("shopId") ON DELETE RESTRICT ON UPDATE CASCADE;
