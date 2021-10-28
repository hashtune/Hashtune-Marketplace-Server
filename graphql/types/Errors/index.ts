import { objectType } from 'nexus';
export * from "./ArtworkErrors";
export * from "./AuctionErrors";
export * from "./UserErrors";

export const ClientErrorUnknown = objectType({
  name: 'ClientErrorUnknown',
  definition(t) {
    t.string('message');
  },
});
