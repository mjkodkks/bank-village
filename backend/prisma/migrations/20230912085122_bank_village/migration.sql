/*
  Warnings:

  - You are about to drop the column `staff` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "interest" DECIMAL(10,2) DEFAULT 0,
ALTER COLUMN "balance" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "staff",
ADD COLUMN     "interest" DECIMAL(10,2),
ADD COLUMN     "staffId" INTEGER;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
