import { extendType, nonNull, stringArg } from 'nexus';
import { Context } from '../../context';

export const deleteArtwork = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('deleteArtwork', {
      type: 'Artwork',
      description:
        'Delete an artwork from the database. Accepts an artork id argument and a user id argument .',
      args: {
        artworkId: nonNull(stringArg()),
        userId: nonNull(stringArg()),
      },
      resolve: async (_, args, ctx: Context) => {
        const artwork = await ctx.prisma.artwork.findUnique({
          where: { id: args.artworkId },
        });
        if (artwork) {
          if (artwork.ownerId == args.userId) {
            return await ctx.prisma.artwork.delete({ where: { id: args.id } })
          } else {
            throw new Error(`Unauthorized`)
          }
        } else {
          throw new Error(`Couldn't find an artowrk with id ${args.id}`);
        }
      },
    });
  },
});
