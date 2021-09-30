import { extendType, nonNull, stringArg } from 'nexus';
import { Context } from '../context';

export const FindUser = extendType({
  type: 'Query',
  definition(t) {
    t.field('findUser', {
      type: 'Artwork',
      description: 'Find an user by handle',
      args: { handle: nonNull(stringArg()) },
      resolve: async (_, args, ctx: Context) => {
        const res = await ctx.prisma.user.findUnique({
          where: { handle: args.handle },
        });
        if (res) {
          return res;
        } else {
          throw new Error(
            `Couldn't find a user with username '${args.handle}'`
          );
        }
      },
    });
  },
});
