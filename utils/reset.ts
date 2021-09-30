import { prisma } from '../singletons/prisma';

export default async function reset() {
  try {
    await prisma.$executeRaw(`DELETE FROM "Artwork";`);
    await prisma.$executeRaw(`DELETE FROM "Sale";`);
    await prisma.$executeRaw(`DELETE FROM "Auction";`);
    await prisma.$executeRaw(`DELETE FROM "Bid";`);
    await prisma.$executeRaw(`DELETE FROM "User";`);
  } catch (e) {
    throw new Error(`${e}`);
  }
}
