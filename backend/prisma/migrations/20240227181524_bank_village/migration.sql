/*
  Warnings:

  - You are about to drop the column `interest` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "interest";

-- CreateTable
CREATE TABLE "Interest" (
    "id" SERIAL NOT NULL,
    "amounts" DECIMAL(10,2) NOT NULL,
    "year" INTEGER NOT NULL,
    "accountId" INTEGER,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Interest_id_key" ON "Interest"("id");

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
