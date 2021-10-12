/*
  Warnings:

  - The `provider` column on the `Wallet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "provider",
ADD COLUMN     "provider" TEXT NOT NULL DEFAULT E'metamask';

-- DropEnum
DROP TYPE "WalletProvider";

-- RenameIndex
ALTER INDEX "User_walletId_unique" RENAME TO "User.walletId_unique";
