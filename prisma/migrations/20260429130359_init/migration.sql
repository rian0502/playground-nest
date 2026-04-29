-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "nest";

-- CreateEnum
CREATE TYPE "nest"."Role" AS ENUM ('ADMIN', 'CASHIER');

-- CreateTable
CREATE TABLE "nest"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "nest"."Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nest"."Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nest"."TransactionHeader" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionHeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nest"."TransactionDetail" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "TransactionDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "nest"."User"("email");

-- CreateIndex
CREATE INDEX "TransactionHeader_userId_idx" ON "nest"."TransactionHeader"("userId");

-- CreateIndex
CREATE INDEX "TransactionDetail_transactionId_idx" ON "nest"."TransactionDetail"("transactionId");

-- CreateIndex
CREATE INDEX "TransactionDetail_productId_idx" ON "nest"."TransactionDetail"("productId");

-- AddForeignKey
ALTER TABLE "nest"."TransactionHeader" ADD CONSTRAINT "TransactionHeader_userId_fkey" FOREIGN KEY ("userId") REFERENCES "nest"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nest"."TransactionDetail" ADD CONSTRAINT "TransactionDetail_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "nest"."TransactionHeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nest"."TransactionDetail" ADD CONSTRAINT "TransactionDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "nest"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
