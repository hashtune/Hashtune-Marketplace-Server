import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({});

// Add event middle ware here...
// Or should it be it's own class that listens for events from the chain?
prisma.$use(async (params, next) => {
  switch (params.model) {
    case 'Artwork':
      if (params.action === 'create' || params.action === 'createMany') {
        // console.log(params.args.data);
        // owner_sale_created
      }
    case 'Sale':
      if (params.action === 'create' || params.action === 'createMany') {
        // owner_sale_ended
        // buyer_sale_created
        // artist_sale_received_royalties
      }
    case 'Auction':
      if (params.action === 'create' || params.action === 'createMany') {
        // owner_sale_created
      }
      // we only update an auction to end it by accepting a price.
      if (params.action === 'update' || params.action === 'updateMany') {
        // if no reserve price:
        // owner_bid_accepted
        // buyer_bid_accepted
        // buyer_bid_lost
        // artist_auction_received_royalties
        // if reserve price and auction:
        // owner_bid_automatically_accepted
        // buyer_bid_automatically_accepted
        // buyer_bid_automatically_lost
        // artist_auction_received_royalties
      }
    case 'Bid':
      if (params.action === 'create' || params.action === 'createMany') {
        // owner_bid_received, buyer_bid_received
        // if this bid was higher than the previous bid:
        // buyer_bid_exceeded
      }
  }
  return next(params);
});

// Create a bid at 60, emit bid received to both users
// End the auction, owner_bid_automatically_accepted and buyer_bid_automatically_accepted
// Sale ends automatically, emit artist auction received royalties, owner sale ended
