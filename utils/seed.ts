import cryptoRandomString from 'crypto-random-string';
import { prisma } from '../singletons/prisma';

export default async function seed() {
  try {
    const generateWallet = async () => {
      const wallet = await prisma.wallet.create({
        data: {
          provider: 'metamask',
          publicKey: cryptoRandomString(20),
        },
      });
      return wallet;
    };

    const user1 = await prisma.user.create({
      data: {
        fullName: 'user 1',
        email: 'user1@dgfhjj.com',
        handle: 'user1',
        bio: "Hey I'm so and so. I've been makign artwork for x amount of years and I'm from blahblah. I love cryptooo..",
        isApprovedCreator: true,
        wallet: {
          connect: {
            id: (await generateWallet()).id,
          },
        },
      },
    });
    const user2 = await prisma.user.create({
      data: {
        fullName: 'user 2',
        email: 'user2@gmail.com',
        handle: 'user2',
        bio: "Hey I'm so an222d so. I've been makign artwork for x amount of years and I'm from blahblah. I love cryptooo..",
        isApprovedCreator: true,
        wallet: {
          connect: {
            id: (await generateWallet()).id,
          },
        },
        owned: {
          create: {
            description: 'song description',
            handle: 'art 1',
            txHash: 'abc123',
            pending: false,
            image: 'blahblah',
            link: 'blahb1lah',
            title: 'amazingsongT1itle',
            media: [{ title: 'amazingsongTitle', media: 'lala' }],
            saleType: 'auction',
            reservePrice: 50,
            creator: {
              connect: {
                id: user1.id,
              },
            },
          },
        },
      },
      include: {
        owned: true,
      },
    });
    const user3 = await prisma.user.create({
      data: {
        fullName: 'user 3',
        email: 'mr3@dgfhjj.com',
        handle: 'user3',
        bio: "Hey I'm not an approved creator and I love cryptooo..",
        isApprovedCreator: false,
        wallet: {
          connect: {
            id: (await generateWallet()).id,
          },
        },
      },
    });

    if (!user1 || !user2 || !user3) throw new Error('no Userss');

    const one = await prisma.artwork.create({
      data: {
        description: 'song description',
        handle: '1',
        txHash: 'abc123',
        pending: false,
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
    const two = await prisma.artwork.create({
      data: {
        description: 'song description',
        handle: '2',
        txHash: 'abc123',
        pending: false,
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
            id: user2.id,
          },
        },
      },
    });
    const three = await prisma.artwork.create({
      data: {
        description: 'song description',
        handle: '3',
        txHash: 'abc123',
        pending: false,
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
            id: user2.id,
          },
        },
      },
      include: {
        auctions: true,
      },
    });
    const four = await prisma.artwork.create({
      data: {
        description: 'song description2',
        handle: '4',
        txHash: 'abc123',
        pending: false,
        image: 'blahblah2',
        link: 'blahblah2',
        title: 'amazingsongTitle2',
        media: [{ title: 'amazingsongTitle2', media: 'lala2' }],
        saleType: 'fixed',
        price: 100,
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
    const five = await prisma.bid.createMany({
      data: [
        {
          auctionId: three.auctions[0].id,
          offer: 25,
          userId: user1.id,
        },
      ],
    });
    const six = await prisma.artwork.create({
      data: {
        description: 'song description',
        handle: '5',
        image: 'blahblah2',
        link: 'blahblah',
        txHash: 'abc123',
        pending: false,
        title: 'amazingsongTitle',
        media: [{ title: 'amazingsongTitle', media: 'lala' }],
        saleType: 'fixed',
        price: 100,
        sales: {
          createMany: {
            data: [
              {
                price: 100,
                userId: user1.id,
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
    const seven = await prisma.artwork.create({
      data: {
        description: 'song description',
        handle: '6',
        image: 'blahblah2',
        link: 'blahblah',
        txHash: 'abc123',
        title: 'pending',
        media: [{ title: 'amazingsongTitle', media: 'lala' }],
        saleType: 'fixed',
        price: 100,
        sales: {
          createMany: {
            data: [
              {
                price: 100,
                userId: user1.id,
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
  } catch (e) {
    throw new Error(`${e}`);
  }
}
