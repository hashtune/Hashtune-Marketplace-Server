import { extendType } from 'nexus';
import { Context } from '../../context';

export const ListUsers = extendType({
  type: 'Query',
  definition(t) {
    t.field('listCreators', {
      type: 'UserResult',
      description: 'Returns all creators where isApprovedCreator is true',
      resolve: async (_, args, ctx: Context) => {
        const res = await ctx.prisma.user.findMany({
          where: {
            isApprovedCreator: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })
        if (res) {
          return { Users: res }
        } else {
          return { ClientErrorUnknown: { message: "Error fetching the users" } }
        }
      },
    });
  },
});
