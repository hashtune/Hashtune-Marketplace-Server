import { objectType } from 'nexus';

export const ClientError = objectType({
  name: 'ClientError',
  definition(t) {
    t.string('given');
  },
});
