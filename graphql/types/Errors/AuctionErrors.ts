import { objectType } from "nexus";

export const ClientErrorAuctionAlreadyExists = objectType({
    name: 'ClientErrorAuctionAlreadyExists',
    definition(t) {
        t.nullable.string('message');
    },
});

export const ClientErrorAuctionNotFound = objectType({
    name: 'ClientErrorAuctionNotFound',
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

export const ClientErrorAuctionNotDeletable = objectType({
    name: 'ClientErrorAuctionNotDeletable',
    definition(t) {
        t.nullable.string('message');
    },
});

export const ClientErrorAuctionNotLive = objectType({
    name: 'ClientErrorAuctionNotLive',
    definition(t) {
        t.nullable.string('message');
    },
});