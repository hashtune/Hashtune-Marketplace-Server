import { objectType } from "nexus";

export const ClientErrorAuctionAlreadyExists = objectType({
    name: 'ClientErrorAuctionAlreadyExists',
    definition(t) {
        t.nullable.string('message');
    },
});

export const ClientErrorArtworkNotAnAuction = objectType({
    name: 'ClientErrorArtworkNotAnAuction',
    definition(t) {
        t.nullable.string('message');
    },
});