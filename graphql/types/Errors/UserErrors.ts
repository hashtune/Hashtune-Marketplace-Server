import { objectType } from "nexus";

export const UserUnauthorized = objectType({
    name: 'UserUnauthorized',
    definition(t) {
        t.nullable.string('message');
    },
});

export const UserNotFoundError = objectType({
    name: 'UserNotFoundError',
    definition(t) {
        t.nullable.string('message');
    },
});