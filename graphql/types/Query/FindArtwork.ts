import { extendType, nonNull, stringArg } from 'nexus';
import { Context } from '../../context';

export const FindArtwork = extendType({
  type: 'Query',
  definition(t) {
    t.field('findArtwork', {
      type: 'ArtworkResult',
      description: 'Find an artwork by handle',
      args: { handle: nonNull(stringArg()) },
      resolve: async (_, args, ctx: Context) => {
        const res = await ctx.prisma.artwork.findUnique({
          where: { handle: args.handle },
        });
        if (res) {
          return { Artworks: [res] };
        } else {
          return {
            ClientErrorArtworkNotFound: { message: "Couldn't find artwork" },
          };
        }
      },
    });
  },
});
