import { objectType } from "nexus";

export const ClientErrorUserUnauthorized = objectType({
    name: 'ClientErrorUserUnauthorized',
    definition(t) {
        t.nullable.string('message');
    },
});

export const ClientErrorUserNotFound = objectType({
    name: 'ClientErrorUserNotFound',
    definition(t) {
        t.nullable.string('message');
    },
});