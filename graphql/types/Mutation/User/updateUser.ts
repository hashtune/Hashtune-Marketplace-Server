import { extendType, inputObjectType } from 'nexus';
import { Context } from '../../../context';

const InputType = inputObjectType({
  name: 'UpdateUserInput',
  description: 'User input',
  definition(t) {
    t.nonNull.string('userId');
    t.string('fullName');
    t.string('handle');
    t.string('email');
    t.string('bio');
    t.string('image');
  },
});

export const updateUser = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateUser', {
      type: 'UserResult',
      description: 'Edit user profile data',
      args: { InputType },
      resolve: async (_, args, ctx: Context) => {
        args = args.InputType;
        //TODO check that the user is authorized
        const userData = await ctx.prisma.user.findUnique({
          where: { id: args.userId },
        });
        if (!userData)
          return {
            ClientErrorUserNotFound: {
              message: "Couldn't find the user",
            },
          };
        const user = await ctx.prisma.user.update({
          where: {
            id: args.userId,
          },
          data: {
            fullName: args.fullName,
            handle: args.handle,
            email: args.email,
            bio: args.bio,
            image: args.image,
          },
        });
        if (user) {
          return { Users: [user] };
        } else {
          return {
            ClientErrorUnknown: {
              message:
                'Something went wrong while editing your profile details. Please contact our technical support',
            },
          };
        }
      },
    });
  },
});
