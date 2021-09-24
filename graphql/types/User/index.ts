import { objectType } from 'nexus';

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
        return res.owned;
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
        return res.created;
      },
    });
  },
});
