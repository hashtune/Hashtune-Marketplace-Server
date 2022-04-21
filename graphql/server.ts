import { ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import express from 'express';
import depthLimit from 'graphql-depth-limit';
import helmet from 'helmet';
import { createServer } from 'http';
import { createContext } from './context';
import { schema } from './schema';

const { PORT = 5000 } = process.env;
const app = express();
const isProduction = process.env.STAGE === 'production';

// TODO move to separate file ./auth/passport.c
// TODO use this passport middleware in mutations
// app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(cookieParser());

app.use(express.json());

app.get(/^\/(?!graphql\/?$)/, (req, res) => {
  res.status(301).redirect('/graphql');
});

export const secret = process.env.SERVER_SECRET ?? '';

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'img-src': [
          'self',
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

const corsOrigin = isProduction
  ? 'https://hashtune.co'
  : [
      'https://studio.apollographql.com',
      'http://localhost:5000',
      'http://localhost:3000',
      'https://hashtune.co',
    ];
const corsOptions = {
  origin: corsOrigin,
  credentials: true,
};

// const ComplexityLimitRule = createComplexityLimitRule(2000, {
//   //TODO set costs for scalars, objects, and lists
//   scalarCost: 1,
//   objectCost: 5,
//   listFactor: 10,
// });

export const apollo = new ApolloServer({
  schema,
  introspection: !isProduction,
  apollo: {},
  context: createContext,
  validationRules: [depthLimit(5)],
  plugins: isProduction ? [ApolloServerPluginLandingPageDisabled()] : [],
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
