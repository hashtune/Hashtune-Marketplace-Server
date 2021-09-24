import { objectType } from 'nexus';

export const Bid = objectType({
  name: 'Bid',
  definition(t) {
    t.string('id');
  },
});
