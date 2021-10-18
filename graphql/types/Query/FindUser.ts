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
        let errorMessage = "";

        const getResult = async (query, error = "") => { res = query && await ctx.prisma.user.findUnique(query); errorMessage = error }

        if (args.handle && !args.publicKey) {
          await getResult({ where: { handle: args.handle } }, `Couldn't find user with handle ${args.handle}`)
        } else if (args.publicKey) {
          const wallet = await ctx.prisma.wallet.findUnique({ where: { publicKey: args.publicKey } })
          await getResult({ where: { walletId: wallet?.id } }, `Couldn't find user with publicKey ${args.publicKey}`)
        } else {
          getResult(null, `Please specify one of the optional fields.`)
        }

        return res ? ({ Users: [res] }) : ({ ClientErrorUserNotFound: { message: errorMessage } })
      },
    });
  },
});
