import { booleanArg, objectType } from 'nexus';
import { Context } from '../../context';

// TODO: make it so each query does not have to live in this file
export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.list.field('listArtworks', {
      type: 'Artwork',
      description:
        'If only auction argument is true then all auctions are returned. If not then all artworks are returned. If auction and trending is true then only auctioned artworks within the last week with over 5 likes are returned.',
      args: {
        auction: booleanArg(),
        trending: booleanArg(),
      },
      resolve: async (_, args, ctx: Context) => {
        if (args.auction) {
          if (args.trending) {
            return ctx.prisma.artwork.findMany({
              where: {
                saleType: 'auction',
                createdAt: {
                  gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
                },
                likes: {
                  gte: 5,
                },
              },
            });
          }
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
    t.list.field('listTrendyCreators', {
      type: 'User',
      description:
        'This query accepts a filter for the user type and one for the time range',
      resolve: async (_, args, ctx: Context) => {
        return await ctx.prisma.user.findMany({
          where: {
            isApprovedCreator: true,
            created: {
              some: {
                createdAt: {
                  gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
                },
                likes: {
                  gte: 5,
                },
              },
            },
          },
        });
      },
    });
  },
});
