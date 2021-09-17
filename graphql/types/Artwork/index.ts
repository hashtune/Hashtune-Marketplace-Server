import { Context } from '@src/context';
import { objectType, queryType } from 'nexus';

export const Artwork = objectType({
  name: 'Artwork',
  isTypeOf(source) {
    return 'kind' in source && source.kind === 'artwork';
  },
  definition(t) {
    // TODO: These fields need to NOT be nullable, but we've made some fields incorrectly
    // in the prisma schema and this needs to be fixed ASAP. THe prisma schema needs an audit
    // because it is restricting us in the graphql layer already
    t.id('id');
    t.string('kind');
    t.nullable.string('type');
    t.string('handle');
    t.string('description');
    t.nullable.int('price');
    t.nullable.field('owner', {
      type: 'User',
      // TODO: stop having to have to explicitly define context
      async resolve(artwork, _, ctx: Context) {
        const memberships = ctx.prisma.artwork.findUnique({
          where: {
            id: artwork.id,
          },
          include: {
            memberships: true,
          },
        });
        return memberships[0];
      },
    });
  },
});
