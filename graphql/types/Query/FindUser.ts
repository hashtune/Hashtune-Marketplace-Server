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
        if (!args.handle && !args.publicKey) {
          return {
            ClientErrorUnknown: {
              message: `Please specify either a handle or a public key`,
            },
          };
        }
        if (args.handle) {
          const maybeExisting = await ctx.prisma.user.findUnique({
            where: {
              handle: args.handle,
            },
          });
          if (!maybeExisting) {
            return {
              ClientErrorUserNotFound: { message: 'User does not exist' },
            };
          } else {
            return { Users: [maybeExisting] };
          }
        } else {
          const maybeExisting = await ctx.prisma.wallet.findUnique({
            where: { publicKey: args.publicKey },
            include: {
              user: true,
            },
          });
          if (!maybeExisting) {
            return {
              ClientErrorUserNotFound: { message: 'User does not exist' },
            };
          } else {
            return { Users: [maybeExisting.user] };
          }
        }
      },
    });
  },
});
