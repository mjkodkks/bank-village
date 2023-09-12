/*
  Warnings:

  - Made the column `amounts` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "amounts" SET NOT NULL;
