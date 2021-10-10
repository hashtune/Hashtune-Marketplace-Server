import { objectType } from 'nexus';

export const Wallet = objectType({
  name: 'Wallet',
  definition(t) {
    t.string('id');
    t.string('provider');
    t.string('publicKey');
    t.string('createdAt');
    t.string('updatedAt');
  },
});
