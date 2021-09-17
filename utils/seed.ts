import { prisma } from '../singletons/prisma';

async function main() {
  const user = await prisma.user.create({
    data: {
      fullName: 'user 1',
      email: 'user1@gmail.com',
      coverImage: 'urlblahblah',
      handle: 'user1',
    },
  });
  const artwork = await prisma.artwork.create({
    data: {
      artworkType: 'song',
      description: 'song description',
      handle: 'amazingsong',
      image: 'blahblah',
      link: 'blahblah',
      title: 'amazingsongTitle',
      startingPrice: 50,
      likedById: user.id,
      auctionId: '1',
      auctions: {
        create: {
          id: '1',
          currentHigh: 10,
        },
      },
    },
  });
  if (!user || !artwork) throw new Error('Failed to seed!');
}

main();
