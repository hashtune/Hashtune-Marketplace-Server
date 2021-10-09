import { extendType, nonNull, stringArg } from 'nexus';
import { Context } from '../../context';

export const FindUser = extendType({
  type: 'Query',
  definition(t) {
    t.field('findUser', {
      type: 'UserResult',
      description: 'Find an user by handle',
      args: { handle: nonNull(stringArg()) },
      resolve: async (_, args, ctx: Context) => {
        const res = await ctx.prisma.user.findUnique({
          where: { handle: args.handle },
        });
        if (res) {
          return { Users: [res] };
        } else {
          return { UserNotFound: { message: `Couldn't find user with handle ${args.handle}` } }
        }
      },
    });
  },
});
