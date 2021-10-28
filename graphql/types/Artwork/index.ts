import { objectType } from 'nexus';
import { Context } from '../../context';
import * as errorTypes from '../Errors';

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
    t.string('image');
    t.string('txHash');
    t.boolean('pending');
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
        // TODO: Refactoring conditionals
        if (res?.creator) {
          return res.creator;
        } else if (res) {
          throw new Error("Couldn't find Artwork");
        } else {
          throw new Error("Couldn't find a creator");
        }
      },
    });
    t.nullable.field('owner', {
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
        if (res) {
          return res.currentOwner;
        } else {
          throw new Error("Couldn't find user");
        }
      },
    });
  },
});

export const ArtworkResult = objectType({
  name: 'ArtworkResult',
  definition(t) {
    t.nullable.list.field('Artworks', { type: 'Artwork' });
    t.nullable.field('ClientErrorArtworkNotFound', {
      type: errorTypes.ClientErrorArtworkNotFound,
    });
    t.nullable.field('ClientErrorArgumentsConflict', {
      type: errorTypes.ClientErrorArgumentsConflict,
    });
    t.nullable.field('ClientErrorUserUnauthorized', {
      type: errorTypes.ClientErrorUserUnauthorized,
    });
    t.nullable.field('ClientErrorUnknown', {
      type: errorTypes.ClientErrorUnknown,
    });
    t.nullable.field('ExternalChainError', {
      type: errorTypes.ExternalChainError,
    });
    t.nullable.field('ExternalChainErrorStillPending', {
      type: errorTypes.ExternalChainErrorStillPending,
    });
  },
});
