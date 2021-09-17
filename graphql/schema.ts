import * as path from 'path';
import * as types from './types';
import { makeSchema } from 'nexus';
import * as NexusPrismaScalarTypes from 'nexus-prisma/scalars';

export const schema = makeSchema({
  prettierConfig: path.join(__dirname, '../.prettierrc'),
  types: [types, NexusPrismaScalarTypes],
  features: {
    abstractTypeStrategies: {
      isTypeOf: true,
    },
  },
  nonNullDefaults: {
    output: true,
  },
  outputs: {
    schema: path.join(__dirname, '/nexus.ts'),
    typegen: path.join(__dirname, '/schema.graphql'),
  },
  contextType: {
    export: 'Context',
    module: path.join(__dirname, '/context.ts'),
  },
  sourceTypes: {
    modules: [{ module: '.prisma/client', alias: 'PrismaClient' }],
  },
});
