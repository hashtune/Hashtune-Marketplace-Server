import { objectType } from "nexus";

export const ArtworkArgumentsConflict = objectType({
    name: 'ArtworkArgumentsConflict',
    definition(t) {
        t.nullable.string('message');
        t.nullable.string('path');
    },
});

export const ArtworkNotFound = objectType({
    name: 'ArtworkNotFound',
    definition(t) {
        t.nullable.string("message");
    }
})