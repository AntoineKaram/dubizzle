-- CreateEnum
CREATE TYPE "EditStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "AdEditRequest" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "paymentOption" TEXT NOT NULL,
    "images" TEXT[],
    "status" "EditStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "AdEditRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdEditRequest_adId_idx" ON "AdEditRequest"("adId");

-- AddForeignKey
ALTER TABLE "AdEditRequest" ADD CONSTRAINT "AdEditRequest_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
