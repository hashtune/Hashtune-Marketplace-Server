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
CREATE TABLE "Artwork" (
    "kind" "ModelKind" NOT NULL DEFAULT E'artwork',
    "id" TEXT NOT NULL,
    "artworkType" "ArtworkType",
    "handle" CITEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "media" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "genre" "Genre"[],
    "saleType" "SaleType",
    "price" BIGINT,
    "startingPrice" BIGINT,
    "auctionId" TEXT NOT NULL,
    "likedById" TEXT NOT NULL,

    CONSTRAINT "Artwork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auction" (
    "kind" "ModelKind" NOT NULL DEFAULT E'auction',
    "id" TEXT NOT NULL,
    "artworkId" TEXT NOT NULL,
    "currentHigh" BIGINT NOT NULL,

    CONSTRAINT "Auction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "kind" "ModelKind" NOT NULL DEFAULT E'bid',
    "id" TEXT NOT NULL,
    "auctionId" TEXT NOT NULL,
    "offer" BIGINT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtworkToUser" (
    "kind" "ModelKind" NOT NULL DEFAULT E'artworkMembership',
    "id" TEXT NOT NULL,
    "role" "ArtworkRole" NOT NULL DEFAULT E'creator',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "artworkId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ArtworkToUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "kind" "ModelKind" NOT NULL DEFAULT E'user',
    "fullName" TEXT,
    "handle" CITEXT,
    "id" TEXT NOT NULL,
    "email" TEXT,
    "image" TEXT,
    "isApprovedCreator" BOOLEAN,
    "coverImage" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "socialLinks" JSONB,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follower" (
    "kind" "ModelKind" NOT NULL DEFAULT E'follower',
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Follower_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_likedBy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_handle_key" ON "User"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Follower_userId_key" ON "Follower"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_publicKey_key" ON "Wallet"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "_likedBy_AB_unique" ON "_likedBy"("A", "B");

-- CreateIndex
CREATE INDEX "_likedBy_B_index" ON "_likedBy"("B");

-- AddForeignKey
ALTER TABLE "Artwork" ADD CONSTRAINT "Artwork_likedById_fkey" FOREIGN KEY ("likedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtworkToUser" ADD CONSTRAINT "ArtworkToUser_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtworkToUser" ADD CONSTRAINT "ArtworkToUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "Artwork"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likedBy" ADD FOREIGN KEY ("A") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likedBy" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
