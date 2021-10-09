/*
  Warnings:

  - You are about to drop the column `userId` on the `Wallet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[walletId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `walletId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "walletId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "userId";

-- CreateIndex
CREATE UNIQUE INDEX "User_walletId_unique" ON "User"("walletId");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
