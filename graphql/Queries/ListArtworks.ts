import { booleanArg, extendType } from 'nexus';
import { Context } from '../context';

export const ListArtworks = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('listArtworks', {
      type: 'Artwork',
      description:
        'If only auction argument is true then all auctions are returned. If not then all artworks are returned. ',
      args: {
        auction: booleanArg(),
        listed: booleanArg(),
      },
      resolve: async (_, args, ctx: Context) => {
        if (args.auction === true) {
          return ctx.prisma.artwork.findMany({
            where: {
              saleType: 'auction',
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
        } else if (args.auction === false) {
          return ctx.prisma.artwork.findMany({
            where: {
              saleType: 'fixed',
              listed: args.listed ? true : undefined,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
        } else {
          return ctx.prisma.artwork.findMany({ orderBy: { saleType: 'asc' } });
        }
      },
    });
  },
});
