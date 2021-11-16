import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import express from 'express';
import depthLimit from 'graphql-depth-limit';
import { createComplexityLimitRule } from 'graphql-validation-complexity';
import helmet from 'helmet';
import { createServer } from 'http';
import { createContext } from './context';
import { schema } from './schema';

const { PORT = 5000 } = process.env;

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'img-src': [
          "'self'",
          'https://apollo-server-landing-page.cdn.apollographql.com/',
        ],
        'script-src': [
          'self',
          'https://apollo-server-landing-page.cdn.apollographql.com/',
        ],
      },
    },
  })
);

const server = createServer(app);

const corsOptions = {
  origin: [
    'https://studio.apollographql.com',
    'http://localhost:5000',
    'http://localhost:3000',
  ],
  credentials: true,
};

const ComplexityLimitRule = createComplexityLimitRule(2000, {
  //TODO set costs for scalars, objects, and lists
  scalarCost: 1,
  objectCost: 5,
  listFactor: 10,
});

export const apollo = new ApolloServer({
  schema,
  introspection: process.env.STAGE !== 'production',
  apollo: {},
  context: createContext,
  validationRules: [depthLimit(5), ComplexityLimitRule],
  plugins: [ApolloServerPluginLandingPageDisabled()],
});

export async function main() {
  await apollo.start();
  apollo.applyMiddleware({ app, cors: corsOptions });
  server.listen({ port: PORT }, () => {
    process.stdout.write(
      ` 🚀  Server ready at http://localhost:${PORT}${apollo.graphqlPath}`
    );
  });
}
process.env.STAGE != 'test' && main();
