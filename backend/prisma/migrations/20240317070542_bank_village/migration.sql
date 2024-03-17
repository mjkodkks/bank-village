/*
  Warnings:

  - A unique constraint covering the columns `[year,accountId]` on the table `Interest` will be added. If there are existing duplicate values, this will fail.
  - Made the column `accountId` on table `Interest` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Interest" DROP CONSTRAINT "Interest_accountId_fkey";

-- DropIndex
DROP INDEX "Interest_id_key";

-- AlterTable
ALTER TABLE "Interest" ALTER COLUMN "accountId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Interest_year_accountId_key" ON "Interest"("year", "accountId");

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
