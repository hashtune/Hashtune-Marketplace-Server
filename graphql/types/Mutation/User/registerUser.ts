import { recoverTypedSignature_v4 } from 'eth-sig-util';
import jwt from 'jsonwebtoken';
import { extendType, inputObjectType, nonNull, stringArg } from 'nexus';
import { validateHandle } from '../../../../utils/validateHandle';
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
        if (!validateHandle(args.handle)) {
          return {
            ClientErrorInvalidHandle: {
              message:
                'We only accept lower case alpha number (abc, 123) characters less than 60 characters',
            },
          };
        }
        // Check if handle is unique
        const maybeExistingHandle = await ctx.prisma.user.findUnique({
          where: {
            handle: args.handle,
          },
        });
        if (maybeExistingHandle)
          return {
            ClientErrorHandleAlreadyExists: {
              message: 'This handle is already taken, please try a new one',
            },
          };

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
        try {
          const res = await ctx.prisma.user.create(payload);
          return { Users: [res] };
        } catch (e) {
          return {
            ClientErrorUnknown: { message: 'Error while creating the user' },
          };
        }
      },
    });
  },
});

export const SignUp = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('cookie', {
      type: 'String',
      args: {
        signedMessage: nonNull(stringArg()),
        publicKey: nonNull(stringArg()),
        typedData: nonNull(stringArg()),
      },
      description: 'Returns cookie if signing',
      resolve: async (_, args, { req, res }) => {
        // TODO proper errors
        const { signedMessage, publicKey, typedData } = args;
        // Extract public key
        let extractedAddress: string = '';
        try {
          extractedAddress = recoverTypedSignature_v4({
            data: JSON.parse(typedData),
            sig: signedMessage,
          });
        } catch (e) {
          console.log(e);
          throw new Error('Issue recovering signature');
        }

        if (extractedAddress !== publicKey) {
          throw new Error('Does not match');
        }
        const token = jwt.sign(
          {
            user: {
              id: extractedAddress,
            },
          },
          process.env.SERVER_SECRET ?? '',
          {
            expiresIn: '1d',
          }
        );
        req.res.cookie('jwt', token, {
          httpOnly: true,
          secure: false, // true in prod,
          sameSite: 'lax', // 'strict' in prod,
        });
        return token;
      },
    });
  },
});
