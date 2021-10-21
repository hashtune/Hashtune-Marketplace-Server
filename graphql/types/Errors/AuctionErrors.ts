import { objectType } from "nexus";

export const ClientErrorAuctionAlreadyExists = objectType({
    name: 'ClientErrorAuctionAlreadyExists',
    definition(t) {
        t.nullable.string('message');
    },
});