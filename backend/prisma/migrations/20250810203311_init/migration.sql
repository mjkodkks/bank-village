-- CreateEnum
CREATE TYPE "public"."InterestType" AS ENUM ('SAVING_INTEREST', 'STOCK_INTEREST', 'LOAN_INTEREST');

-- CreateEnum
CREATE TYPE "public"."TransactionAction" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'INTEREST');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "public"."AccountType" AS ENUM ('SAVING', 'STOCK', 'LOAN');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "lastLogin" TIMESTAMP(3),
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "address" TEXT,
    "nickName" TEXT,
    "citizenId" TEXT,
    "brithday" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "firstname" TEXT,
    "surname" TEXT,
    "tel" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" SERIAL NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "type" "public"."AccountType" NOT NULL DEFAULT 'SAVING',

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" SERIAL NOT NULL,
    "action" "public"."TransactionAction" NOT NULL,
    "previousBalance" DECIMAL(10,2),
    "changeBalance" DECIMAL(10,2),
    "amounts" DECIMAL(10,2),
    "interest" DECIMAL(10,2),
    "accountId" INTEGER,
    "staffId" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InterestRate" (
    "id" SERIAL NOT NULL,
    "type" "public"."InterestType" NOT NULL,
    "rate" DECIMAL(5,2) NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),

    CONSTRAINT "InterestRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "public"."User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Account_id_key" ON "public"."Account"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_id_key" ON "public"."Transaction"("id");

-- CreateIndex
CREATE INDEX "InterestRate_type_effectiveFrom_effectiveTo_idx" ON "public"."InterestRate"("type", "effectiveFrom", "effectiveTo");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
