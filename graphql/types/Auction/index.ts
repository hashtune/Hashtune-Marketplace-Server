import { objectType } from 'nexus';
import { Context } from '../../context';

export const Auction = objectType({
  name: 'Auction',
  definition(t) {
    t.string('id');
    t.field('currentHigh', {
      type: 'BigInt',
    });
    t.nullable.field('liveAt', {
      type: 'DateTime'
    })
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
