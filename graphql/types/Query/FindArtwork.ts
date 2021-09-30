import { extendType, nonNull, stringArg } from 'nexus';
import { Context } from '../context';

export const FindArtwork = extendType({
  type: 'Query',
  definition(t) {
    t.field('findArtwork', {
      type: 'Artwork',
      description: 'Find an artwork by id',
      args: { id: nonNull(stringArg()) },
      resolve: async (_, args, ctx: Context) => {
        const res = await ctx.prisma.artwork.findUnique({
          where: { id: args.id },
        });
        if (res) {
          return res;
        } else {
          throw new Error(`Couldn't find an artwork with id '${args.id}'`);
        }
      },
    });
  },
});
