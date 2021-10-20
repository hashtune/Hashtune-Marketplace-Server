import { objectType } from 'nexus';
import { Context } from '../../context';
import * as errorTypes from '../Errors';

export const Auction = objectType({
  name: 'Auction',
  definition(t) {
    t.string('id');
    t.field('currentHigh', {
      type: 'BigInt',
    });
    t.nullable.field('liveAt', {
      type: 'DateTime',
    });
    t.string('artworkId');
    t.list.field('bids', {
      type: 'Bid',
      resolve: async (auction, _, ctx: Context) => {
        const res = await ctx.prisma.bid.findMany({
          where: {
            auctionId: auction.id,
          },
          include: {
            user: true,
          },
        });
        return res;
      },
    });
  },
});


export const AuctionResult = objectType({
  name: "AuctionResult",
  definition(t) {
    t.nullable.field("Auction", { type: "Auction" })
    t.nullable.field("ClientErrorUserUnauthorized", { type: errorTypes.ClientErrorUserUnauthorized });
    t.nullable.field("ClientErrorUnknown", { type: errorTypes.ClientErrorUnknown });
  }
})