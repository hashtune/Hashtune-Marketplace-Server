import { objectType } from 'nexus';

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

export const ClientErrorJWTInvalid = objectType({
  name: 'ClientErrorJWTInvalid',
  definition(t) {
    t.nullable.string('message');
  },
});

export const ClientErrorInvalidHandle = objectType({
  name: 'ClientErrorInvalidHandle',
  definition(t) {
    t.nullable.string('message');
  },
});

export const ClientErrorHandleAlreadyExists = objectType({
  name: 'ClientErrorHandleAlreadyExists',
  definition(t) {
    t.nullable.string('message');
  },
});
