import { prisma } from '../singletons/prisma';

export default async function main() {
  const user1 = await prisma.user.create({
    data: {
      fullName: 'user 1',
      email: 'user1@gmail.com',
      handle: 'user1',
      bio: "Hey I'm so and so. I've been makign artwork for x amount of years and I'm from blahblah. I love cryptooo..",
      isApprovedCreator: true,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      fullName: 'user 2',
      email: 'user2@gmail.com',
      handle: 'user2',
      bio: "Hey I'm so and so. I've been makign artwork for x amount of years and I'm from blahblah. I love cryptooo..",
      isApprovedCreator: true,
    },
  });
  const artworkWithReservePrice = await prisma.artwork.create({
    data: {
      description: 'song description',
      handle: 'amazingsong',
      image: 'blahblah',
      link: 'blahblah',
      title: 'amazingsongTitle',
      media: [{ title: 'amazingsongTitle', media: 'lala' }],
      saleType: 'auction',
      reservePrice: 50,
      currentOwner: {
        connect: {
          id: user1.id,
        },
      },
      creator: {
        connect: {
          id: user1.id,
        },
      },
    },
  });
  const artworkWithNoReservePrice = await prisma.artwork.create({
    data: {
      description: 'song description',
      handle: 'hello',
      image: 'nothing',
      link: 'blahblah',
      title: 'amazingsongTitle',
      media: [{ title: 'amazingsongTitle', media: 'lala' }],
      saleType: 'auction',
      currentOwner: {
        connect: {
          id: user2.id,
        },
      },
      creator: {
        connect: {
          id: user1.id,
        },
      },
    },
  });
  const artworkWitReservePriceWithHistory = await prisma.artwork.create({
    data: {
      description: 'song description',
      handle: 'history',
      image: 'blahblah2',
      link: 'blahblah',
      title: 'amazingsongTitle',
      media: [{ title: 'amazingsongTitle', media: 'lala' }],
      saleType: 'auction',
      reservePrice: 50,
      auctions: {
        createMany: {
          data: [{}],
        },
      },
      currentOwner: {
        connect: {
          id: user1.id,
        },
      },
      creator: {
        connect: {
          id: user1.id,
        },
      },
    },
    include: {
      auctions: true,
    },
  });
  await prisma.bid.createMany({
    data: [
      {
        auctionId: artworkWitReservePriceWithHistory!.auctions[0].id,
        offer: 25,
        userId: user2.id,
      },
    ],
  });
  const artworkWithFixedSale = await prisma.artwork.create({
    data: {
      description: 'song description2',
      handle: 'amazingsong2',
      image: 'blahblah2',
      link: 'blahblah2',
      title: 'amazingsongTitle2',
      media: [{ title: 'amazingsongTitle2', media: 'lala2' }],
      saleType: 'fixed',
      price: 100,
      currentOwner: {
        connect: {
          id: user2.id,
        },
      },
      creator: {
        connect: {
          id: user2.id,
        },
      },
    },
  });
  const artworkFixedSaleWithHistory = await prisma.artwork.create({
    data: {
      description: 'song description',
      handle: 'fixedwithhistory',
      image: 'blahblah2',
      link: 'blahblah',
      title: 'amazingsongTitle',
      media: [{ title: 'amazingsongTitle', media: 'lala' }],
      saleType: 'fixed',
      price: 100,
      sales: {
        createMany: {
          data: [
            {
              price: 100,
              userId: user2.id,
            },
          ],
        },
      },
      currentOwner: {
        connect: {
          id: user1.id,
        },
      },
      creator: {
        connect: {
          id: user1.id,
        },
      },
    },
  });

  if (
    !user1 ||
    !user2 ||
    !artworkWithFixedSale ||
    !artworkWithNoReservePrice ||
    !artworkWithReservePrice ||
    !artworkWitReservePriceWithHistory || // should cover non reserved prices as well
    !artworkFixedSaleWithHistory
  )
    throw new Error('Failed to seed!');
}
