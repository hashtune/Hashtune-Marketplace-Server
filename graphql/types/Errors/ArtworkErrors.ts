import { objectType } from "nexus";

export const ClientErrorArgumentsConflict = objectType({
    name: 'ClientErrorArgumentsConflict',
    definition(t) {
        t.nullable.string('message');
        t.nullable.string('path');
    },
});

export const ClientErrorArtworkNotFound = objectType({
    name: 'ClientErrorArtworkNotFound',
    definition(t) {
        t.nullable.string("message");
    }
})