import { extendType } from 'nexus';
import { Context } from '../context';

export const ListUsers = extendType({
  type: 'Query',
  definition(t) {
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
