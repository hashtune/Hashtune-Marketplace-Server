import { objectType } from 'nexus';
import { Context } from '../../context';

export const Artwork = objectType({
  name: 'Artwork',
  definition(t) {
    // TODO: These fields need to NOT be nullable, but we've made some fields incorrectly
    // in the prisma schema and this needs to be fixed ASAP. THe prisma schema needs an audit
    // because it is restricting us in the graphql layer already
    t.id('id');
    t.string('kind');
    t.string('handle');
    t.string('title');
    t.string('description');
    t.boolean('listed');
    t.nullable.field('price', {
      type: 'BigInt',
    });
    t.nullable.field('reservePrice', {
      type: 'BigInt',
    });
    t.string('saleType');
    t.list.field('Auctions', {
      type: 'Auction',
      resolve: async (artwork, _, ctx: Context) => {
        const res = await ctx.prisma.auction.findMany({
          where: {
            artworkId: artwork.id,
          },
          include: {
            bids: true,
          },
          orderBy: {
            updatedAt: 'desc',
          },
        });
        return res;
      },
    });
    t.nullable.field('latestAuction', {
      type: 'Auction',
      resolve: async (artwork, _, ctx: Context) => {
        const res = await ctx.prisma.auction.findMany({
          where: {
            artworkId: artwork.id,
          },
          include: {
            bids: true,
          },
          orderBy: {
            updatedAt: 'desc',
          },
        });
        return res[0];
      },
    });
    t.boolean('auctionWithNoReservePriceAndNoBids', {
      resolve: async (artwork, _, ctx: Context) => {
        const res = await ctx.prisma.auction.findMany({
          where: {
            artworkId: artwork.id,
          },
          orderBy: {
            updatedAt: 'desc',
          },
        });
        if (artwork.saleType === 'fixed') return false;
        if (!artwork.listed) return false;
        if (artwork.reservePrice && artwork.reservePrice > 0) return false;
        if (res[0]?.currentHigh > 0) return false;
        return true;
      },
    });
    // TODO: Handle null and int return types
    t.field('creator', {
      type: 'User',
      resolve: async (artwork, _, ctx: Context) => {
        const res = await ctx.prisma.artwork.findUnique({
          where: {
            id: artwork.id,
          },
          include: {
            creator: true,
          },
        });
        return res?.creator;
      },
    });
    t.nullable.field('owner', {
      // TODO: Allow multiple types
      type: 'User',
      // TODO: stop having to have to explicitly define context
      async resolve(artwork, _, ctx: Context) {
        const res = await ctx.prisma.artwork.findUnique({
          where: {
            id: artwork.id,
          },
          include: {
            currentOwner: true,
          },
          rejectOnNotFound: true,
        });
        return res.currentOwner;
      },
    });
  },
});
