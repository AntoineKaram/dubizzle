/*
  Warnings:

  - The `status` column on the `AdEditRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AdEditRequest" DROP COLUMN "status",
ADD COLUMN     "status" "AdStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "EditStatus";

-- AddForeignKey
ALTER TABLE "AdEditRequest" ADD CONSTRAINT "AdEditRequest_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
