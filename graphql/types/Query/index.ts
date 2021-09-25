import { booleanArg, objectType } from 'nexus';
import { Context } from '../../context';

// TODO: make it so each query does not have to live in this file
export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.list.field('listArtworks', {
      type: 'Artwork',
      description:
        'If only auction argument is true then all auctions are returned. If not then all artworks are returned. ',
      args: {
        auction: booleanArg(),
      },
      resolve: async (_, args, ctx: Context) => {
        if (args.auction) {
          return ctx.prisma.artwork.findMany({
            where: {
              saleType: 'auction',
            },
          });
        }
        // Both sale and non sale
        return ctx.prisma.artwork.findMany({});
      },
    });
    t.list.field('listCreators', {
      type: 'User',
      description: 'Returns all creators where isApprovedCreator is true',
      resolve: async (_, args, ctx: Context) => {
        return await ctx.prisma.user.findMany({
          where: {
            isApprovedCreator: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      },
    });
  },
});
