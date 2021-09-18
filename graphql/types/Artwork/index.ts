import { objectType } from 'nexus';
import { Context } from '../../context';

export const Artwork = objectType({
  name: 'Artwork',
  definition(t) {
    // TODO: These fields need to NOT be nullable, but we've made some fields incorrectly
    // in the prisma schema and this needs to be fixed ASAP. THe prisma schema needs an audit
    // because it is restricting us in the graphql layer already
    t.id('id');
    t.string('kind');
    t.nullable.string('type');
    t.string('handle');
    t.string('description');
    // TODO: Handle null and int return types
    // t.nullable.field('price');
    t.nullable.field('owner', {
      // TODO: Allow multiple types
      type: 'User',
      // TODO: stop having to have to explicitly define context
      async resolve(artwork, _, ctx: Context) {
        const res = await ctx.prisma.artwork.findUnique({
          where: {
            id: artwork.id,
          },
          include: {
            currentOwner: true,
          },
          rejectOnNotFound: true,
        });
        return res.currentOwner;
      },
    });
  },
});
