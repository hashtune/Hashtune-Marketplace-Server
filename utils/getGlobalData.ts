import { prisma } from '../singletons/prisma';

export default async function getGlobalData() {
  const users = await prisma.user.findMany({});
  const artworks = await prisma.artwork.findMany({});
  const wallets = await prisma.wallet.findMany({});
  const auctions = await prisma.auction.findMany({});
  if (!users || !artworks || !wallets || !auctions)
    throw new Error('Unable to set up global data');
  return { users, artworks, wallets, auctions };
}
