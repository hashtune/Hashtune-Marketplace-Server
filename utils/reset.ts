import { prisma } from '../singletons/prisma';

export default async function reset() {
  try {
    await prisma.$transaction([
      prisma.bid.deleteMany({}),
      prisma.auction.deleteMany({}),
      prisma.sale.deleteMany({}),
      prisma.artwork.deleteMany({}),
      prisma.user.deleteMany({}),
    ]);
  } catch (e) {
    console.log('error tearing down tests', e);
  }
}
