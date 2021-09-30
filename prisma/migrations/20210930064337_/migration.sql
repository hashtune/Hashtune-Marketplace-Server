-- CreateEnum
CREATE TYPE "ModelKind" AS ENUM ('artwork', 'artworkMembership', 'user', 'wallet', 'auction', 'bid', 'sale');

-- CreateEnum
CREATE TYPE "ArtworkRole" AS ENUM ('creator', 'feature', 'owner');

-- CreateEnum
CREATE TYPE "SaleType" AS ENUM ('auction', 'fixed');

-- CreateEnum
CREATE TYPE "WalletProvider" AS ENUM ('metamask');

-- CreateTable
CREATE TABLE "User" (
    "kind" "ModelKind" NOT NULL DEFAULT E'user',
    "fullName" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "image" TEXT,
    "isApprovedCreator" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "socialLinks" JSONB,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artwork" (
    "kind" "ModelKind" NOT NULL DEFAULT E'artwork',
    "id" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "media" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "saleType" "SaleType" NOT NULL,
    "price" BIGINT,
    "reservePrice" BIGINT,
    "ownerId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "listed" BOOLEAN NOT NULL DEFAULT true,
    "streamCount" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auction" (
    "kind" "ModelKind" NOT NULL DEFAULT E'auction',
    "id" TEXT NOT NULL,
    "artworkId" TEXT NOT NULL,
    "currentHigh" BIGINT NOT NULL DEFAULT 0,
    "currentHighBidder" TEXT,
    "live" BOOLEAN NOT NULL DEFAULT false,
    "liveAt" TIMESTAMP(3),
    "isFinalized" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "kind" "ModelKind" NOT NULL DEFAULT E'sale',
    "id" TEXT NOT NULL,
    "artworkId" TEXT NOT NULL,
    "price" BIGINT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "kind" "ModelKind" NOT NULL DEFAULT E'bid',
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "offer" BIGINT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "kind" "ModelKind" NOT NULL DEFAULT E'wallet',
    "id" TEXT NOT NULL,
    "provider" "WalletProvider" NOT NULL,
    "publicKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_features" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.handle_unique" ON "User"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Artwork.handle_unique" ON "Artwork"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet.publicKey_unique" ON "Wallet"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "_features_AB_unique" ON "_features"("A", "B");

-- CreateIndex
CREATE INDEX "_features_B_index" ON "_features"("B");

-- AddForeignKey
ALTER TABLE "Artwork" ADD FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artwork" ADD FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_features" ADD FOREIGN KEY ("A") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_features" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
