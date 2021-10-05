import { objectType } from 'nexus';
export * from "./ArtworkErrors";
export * from "./UserErrors";

export const ClientError = objectType({
  name: 'ClientError',
  definition(t) {
    t.string('message');
  },
});
