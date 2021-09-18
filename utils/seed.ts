import { prisma } from '../singletons/prisma';

async function main() {
  const user1 = await prisma.user.create({
    data: {
      fullName: 'user 1',
      email: 'user1@gmail.com',
      coverImage: 'urlblahblah',
      handle: 'user1',
    },
  });
  const user2 = await prisma.user.create({
    data: {
      fullName: 'user 2',
      email: 'user2@gmail.com',
      coverImage: 'urlblahblah',
      handle: 'user2',
    },
  });
  const artwork1 = await prisma.artwork.create({
    data: {
      artworkType: 'song',
      description: 'song description',
      handle: 'amazingsong',
      image: 'blahblah',
      link: 'blahblah',
      title: 'amazingsongTitle',
      media: [{ title: 'amazingsongTitle', media: 'lala' }],
      saleType: 'auction',
      startingPrice: 50,
      likedBy: {
        connect: {
          id: user1.id,
        },
      },
      currentOwner: {
        connect: {
          id: user1.id,
        },
      },
      creators: {
        connect: {
          id: user1.id,
        },
      },
      auction: {
        create: {
          id: '1',
          currentHigh: 10,
        },
      },
    },
  });
  const artwork2 = await prisma.artwork.create({
    data: {
      artworkType: 'album',
      description: 'song description2',
      handle: 'amazingsong2',
      image: 'blahblah2',
      link: 'blahblah2',
      title: 'amazingsongTitle2',
      media: [{ title: 'amazingsongTitle2', media: 'lala2' }],
      saleType: 'fixed',
      price: 100,
      likedBy: {
        connect: {
          id: user2.id,
        },
      },
      currentOwner: {
        connect: {
          id: user2.id,
        },
      },
      creators: {
        connect: {
          id: user2.id,
        },
      },
    },
  });
  if (!user1 || !artwork1 || !user2 || !artwork2)
    throw new Error('Failed to seed!');
}

main()
  .then(() => {
    console.log('seeded successfully');
    process.exit(0);
  })
  .catch(e => {
    console.log('error seeding', e);
    process.exit(1);
  });
