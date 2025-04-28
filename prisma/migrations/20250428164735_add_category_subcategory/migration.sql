/*
  Warnings:

  - You are about to drop the column `category` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `locationCity` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `locationCountry` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedAt` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedBy` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `rejectionReason` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `sellerId` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `subcategory` on the `Ad` table. All the data in the column will be lost.
  - Added the required column `location` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentOption` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subcategoryId` to the `Ad` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ad" DROP CONSTRAINT "Ad_sellerId_fkey";

-- AlterTable
ALTER TABLE "Ad" DROP COLUMN "category",
DROP COLUMN "locationCity",
DROP COLUMN "locationCountry",
DROP COLUMN "modifiedAt",
DROP COLUMN "modifiedBy",
DROP COLUMN "rejectionReason",
DROP COLUMN "sellerId",
DROP COLUMN "subcategory",
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "paymentOption" TEXT NOT NULL,
ADD COLUMN     "subcategoryId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subcategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Ad_createdBy_idx" ON "Ad"("createdBy");

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
