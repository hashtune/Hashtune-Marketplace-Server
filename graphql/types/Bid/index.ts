import { objectType } from 'nexus';
import * as errorTypes from '../Errors';

export const Bid = objectType({
  name: 'Bid',
  definition(t) {
    t.string('id');
    t.field('offer', { type: "BigInt" })
  },
});

export const BidResult = objectType({
  name: "BidResult",
  definition(t) {
    t.nullable.list.field('Bids', { type: 'Bid' });
    t.nullable.field('ClientErrorAuctionNotFound', {
      type: errorTypes.ClientErrorAuctionNotFound,
    });
    t.nullable.field('ClientErrorArgumentsConflict', {
      type: errorTypes.ClientErrorArgumentsConflict,
    });
    t.nullable.field('ClientErrorUserUnauthorized', {
      type: errorTypes.ClientErrorUserUnauthorized,
    });
    t.nullable.field('ClientErrorUnknown', {
      type: errorTypes.ClientErrorUnknown,
    });
    t.nullable.field('ClientErrorAuctionNotLive', {
      type: errorTypes.ClientErrorAuctionNotLive
    });
    t.nullable.field('ExternalChainErrorStillPending', {
      type: errorTypes.ExternalChainErrorStillPending,
    });
  }
})