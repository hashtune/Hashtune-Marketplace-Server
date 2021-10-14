import { extendType, stringArg } from 'nexus';
import { Context } from '../../context';

export const FindUser = extendType({
  type: 'Query',
  definition(t) {
    t.field('findUser', {
      type: 'UserResult',
      description: 'Find an user by handle or public key',
      args: { handle: stringArg(), publicKey: stringArg() },
      resolve: async (_, args, ctx: Context) => {

        let res;
        let errorMessage: string;

        if (args.handle && !args.publicKey) {
          res = await ctx.prisma.user.findUnique({
            where: { handle: args.handle },
          });
          errorMessage = `Couldn't find user with handle ${args.handle}`
        } else if (args.publicKey) {
          const wallet = await ctx.prisma.wallet.findUnique({ where: { publicKey: args.publicKey } })
          res = wallet && await ctx.prisma.user.findUnique({
            where: {
              walletId: wallet.id
            }
          });
          errorMessage = `Couldn't find user with publicKey ${args.publicKey}`
        } else {
          res = null;
          errorMessage = `Please specify one of the optional fields.`
        }

        if (res) {
          return { Users: [res] };
        } else {
          return { ClientErrorUserNotFound: { message: errorMessage } }
        }
      },
    });
  },
});
