import { booleanArg, objectType } from 'nexus';
import { Context } from '../../context';

// TODO: make it so each query does not have to live in this file
export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.list.field('listArtworks', {
      type: 'Artwork',
      description:
        'This query accepts a boolean argument whether to filter only for auctions or not',
      args: {
        auction: booleanArg(),
      },
      resolve: async (_, args, ctx: Context) => {
        if (args.auction) {
          // TODO filter for auctions
          return ctx.prisma.artwork.findMany({});
        }
        return ctx.prisma.artwork.findMany({});
      },
    });
  },
});
