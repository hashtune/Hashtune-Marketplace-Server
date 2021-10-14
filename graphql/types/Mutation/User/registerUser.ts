import { extendType, inputObjectType } from 'nexus';
import { Context } from '../../../context';

const InputType = inputObjectType({
  name: 'RegisterUserInput',
  description: 'Input for registering a new user',
  definition(t) {
    t.string('fullName');
    t.nonNull.string('handle');
    t.nonNull.string('email');
    t.string('bio');
    t.nullable.string('image');
    t.boolean('isApprovedCreator', { default: false });
    t.nonNull.string('wallet');
  },
});

export const registerUser = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('registerUser', {
      type: 'UserResult',
      description:
        'Register a user after they authenticate with the correct chain network',
      args: { InputType },
      resolve: async (_, args, ctx: Context) => {
        args = args.InputType;
        const payload = {
          data: {
            fullName: args.fullName,
            handle: args.handle,
            email: args.email,
            image: args.image,
            bio: args.bio,
            isApprovedCreator: false,
            wallet: {
              create: {
                publicKey: args.wallet,
              },
            },
          },
        };

        const res = await ctx.prisma.user.create(payload);
        return res ? ({ Users: [res] }) : ({ ClientErrorUnknown: { message: "Error while creating the user" } })
        // TODO: Handling potential mutation errors
      },
    });
  },
});
