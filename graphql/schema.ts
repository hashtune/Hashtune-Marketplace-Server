import { makeSchema } from 'nexus';
import * as NexusPrismaScalarTypes from 'nexus-prisma/scalars';
import * as path from 'path';
import * as types from './types';

export const schema = makeSchema({
  prettierConfig: process.env.STAGE != 'test' ? path.join(process.cwd(), '/.prettierrc') : undefined,
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
    schema: path.join(
      __dirname,
      '../node_modules/@types/nexus-typegen/index.d.ts'
    ),
    typegen: path.join(__dirname, '/generated/schema.graphql'),
  },
  contextType: {
    export: 'Context',
    module: path.join(process.cwd(), '/graphql/context.ts'),
  },
  sourceTypes: {
    modules: [{ module: '.prisma/client', alias: 'PrismaClient' }],
  },
});
