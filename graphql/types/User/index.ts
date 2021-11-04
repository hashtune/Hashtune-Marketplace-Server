import { objectType } from 'nexus';
import * as errorTypes from '../Errors';

export const UserType = objectType({
  name: 'User',
  definition(t) {
    t.string('id');
    t.string('fullName');
    t.string('handle');
    t.string('email');
    t.string('bio');
    t.nullable.string('image');
    t.boolean('isApprovedCreator');
    t.field('wallet', {
      type: 'Wallet',
      resolve: async (user, _, ctx) => {
        const res = await ctx.prisma.user.findUnique({
          where: {
            id: user.id,
          },
          include: {
            wallet: true,
          },
        });
        return res.wallet;
      },
    });
    t.list.field('owned', {
      type: 'Artwork',
      resolve: async (user, _, ctx) => {
        const res = await ctx.prisma.user.findUnique({
          where: {
            id: user.id,
          },
          include: {
            owned: true,
          },
        });
        // Filter out pending
        return res.owned.filter(art => art && art.pending === false);
      },
    });
    t.list.field('created', {
      type: 'Artwork',
      resolve: async (user, _, ctx) => {
        const res = await ctx.prisma.user.findUnique({
          where: {
            id: user.id,
          },
          include: {
            created: true,
          },
        });
        // Filter out pending
        return res.created.filter(art => art && art.pending === false);
      },
    });
  },
});

export const UserResult = objectType({
  name: 'UserResult',
  definition(t) {
    t.nullable.list.field('Users', { type: 'User' });
    t.nullable.field('ClientErrorUserNotFound', {
      type: errorTypes.ClientErrorUserNotFound,
    });
    t.nullable.field('ClientErrorUnknown', {
      type: errorTypes.ClientErrorUnknown,
    });
    t.nullable.field('ClientErrorInvalidHandle', {
      type: errorTypes.ClientErrorInvalidHandle,
    });
    t.nullable.field('ClientErrorHandleAlreadyExists', {
      type: errorTypes.ClientErrorHandleAlreadyExists,
    });
  },
});
