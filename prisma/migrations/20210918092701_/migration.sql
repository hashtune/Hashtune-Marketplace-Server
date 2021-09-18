-- CreateEnum
CREATE TYPE "ModelKind" AS ENUM ('artwork', 'artworkMembership', 'user', 'wallet', 'notification', 'follower', 'auction', 'bid');

-- CreateEnum
CREATE TYPE "ArtworkRole" AS ENUM ('creator', 'feature', 'owner');

-- CreateEnum
CREATE TYPE "SaleType" AS ENUM ('auction', 'fixed');

-- CreateEnum
CREATE TYPE "ArtworkType" AS ENUM ('song', 'album');

-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('rock', 'electronic', 'shoegaze', 'dreampop', 'indierock', 'postrock', 'stuffonlymeandmyfriendsknow');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('like', 'follower', 'sale');

-- CreateEnum
CREATE TYPE "WalletProvider" AS ENUM ('metamask');

-- CreateTable
CREATE TABLE "User" (
    "kind" "ModelKind" NOT NULL DEFAULT E'user',
    "fullName" TEXT,
    "handle" TEXT,
    "id" TEXT NOT NULL,
    "email" TEXT,
    "image" TEXT,
    "isApprovedCreator" BOOLEAN,
    "coverImage" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "socialLinks" JSONB,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artwork" (
    "kind" "ModelKind" NOT NULL DEFAULT E'artwork',
    "id" TEXT NOT NULL,
    "artworkType" "ArtworkType" NOT NULL,
    "handle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "media" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "genre" "Genre"[],
    "saleType" "SaleType" NOT NULL,
    "price" BIGINT,
    "startingPrice" BIGINT,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auction" (
    "kind" "ModelKind" NOT NULL DEFAULT E'auction',
    "id" TEXT NOT NULL,
    "artworkId" TEXT NOT NULL,
    "currentHigh" BIGINT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "kind" "ModelKind" NOT NULL DEFAULT E'bid',
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "offer" BIGINT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follower" (
    "kind" "ModelKind" NOT NULL DEFAULT E'follower',
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "kind" "ModelKind" NOT NULL DEFAULT E'notification',
    "id" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL,
    "receiverId" TEXT NOT NULL,
    "userId" TEXT,
    "type" "NotificationType" NOT NULL,
    "artworkId" TEXT,
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
CREATE TABLE "_likedBy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_creators" (
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
CREATE UNIQUE INDEX "Auction_artworkId_unique" ON "Auction"("artworkId");

-- CreateIndex
CREATE UNIQUE INDEX "Follower.userId_unique" ON "Follower"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet.publicKey_unique" ON "Wallet"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "_likedBy_AB_unique" ON "_likedBy"("A", "B");

-- CreateIndex
CREATE INDEX "_likedBy_B_index" ON "_likedBy"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_creators_AB_unique" ON "_creators"("A", "B");

-- CreateIndex
CREATE INDEX "_creators_B_index" ON "_creators"("B");

-- AddForeignKey
ALTER TABLE "Artwork" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likedBy" ADD FOREIGN KEY ("A") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likedBy" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_creators" ADD FOREIGN KEY ("A") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_creators" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
