import { extendType } from 'nexus';
import { Context } from '../../../context';

export const disconnectUser = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('disconnected', {
      type: 'Boolean',
      description: 'Disconnects a user by clearing their jwt',
      resolve: async (_, args, ctx: Context) => {
        ctx.req.res.clearCookie('jwt');
        return true;
      },
    });
  },
});
