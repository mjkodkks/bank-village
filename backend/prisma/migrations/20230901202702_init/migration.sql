-- CreateEnum
CREATE TYPE "TransactionAction" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('SAVING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3),
    "role" "Role" NOT NULL DEFAULT 'USER',
    "address" TEXT,
    "nickName" TEXT,
    "citizenId" TEXT,
    "brithday" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "type" "AccountType" NOT NULL DEFAULT 'SAVING',

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "action" "TransactionAction" NOT NULL,
    "previousBalance" DOUBLE PRECISION,
    "changeBalance" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT,
    "note" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_id_key" ON "Account"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_id_key" ON "Transaction"("id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
