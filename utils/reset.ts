import { prisma } from '../singletons/prisma';

export default async function reset() {
  try {
    const models: string[] = [
      'Artwork',
      'Sale',
      'Auction',
      'Bid',
      'User',
      'Wallet',
    ];
    for (const model in models) {
      await prisma.$executeRaw(`DELETE FROM "${models[model]}";`);
    }
  } catch (e) {
    throw new Error(`${e}`);
  }
}
