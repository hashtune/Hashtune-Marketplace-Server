import { booleanArg, extendType, stringArg } from 'nexus';
import { Artwork } from '../../../node_modules/.prisma/client/index';
import { Context } from '../../context';

export const ListArtworks = extendType({
  type: 'Query',
  definition(t) {
    t.field('listArtworks', {
      type: 'ArtworkResult',
      description:
        'If only auction argument is true then all auctions are returned. If not then all artworks are returned. ',
      args: {
        auction: booleanArg(),
        listed: booleanArg(),
      },
      resolve: async (_, args, ctx: Context) => {
        console.log(ctx.user);
        let res: Artwork[];
        if (args.auction === true) {
          res = await ctx.prisma.artwork.findMany({
            where: {
              saleType: 'auction',
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
        } else if (args.auction === false) {
          res = await ctx.prisma.artwork.findMany({
            where: {
              saleType: 'fixed',
              listed: args.listed ? true : undefined,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
        } else {
          res = await ctx.prisma.artwork.findMany({
            orderBy: { saleType: 'desc' },
          });
        }

        if (res) {
          return { Artworks: res };
        } else {
          return {
            ClientErrorUnknown: { message: 'Error fetching the artworks' },
          };
        }
      },
    });
  },
});

export const CheckFree = extendType({
  type: 'Query',
  definition(t) {
    t.field('handle', {
      type: 'Boolean',
      description: 'Checks whether the give handle is free or not.',
      args: {
        handle: stringArg(),
      },
      resolve: async (_, args, ctx: Context) => {
        const maybeHandleTaken = await ctx.prisma.artwork.findUnique({
          where: {
            handle: args.handle,
          },
        });
        if (maybeHandleTaken) {
          return false;
        } else {
          return true;
        }
      },
    });
  },
});
