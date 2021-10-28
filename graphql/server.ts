import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import depthLimit from 'graphql-depth-limit';
import { createServer } from 'http';
import { createContext } from './context';
import { schema } from './schema';

const { PORT = 5000 } = process.env;

const app = express();
const server = createServer(app);

export const apollo = new ApolloServer({
  schema,
  introspection: false,
  apollo: {},
  context: createContext,
  validationRules: [depthLimit(5)]
});

export async function main() {
  await apollo.start();
  apollo.applyMiddleware({ app });
  server.listen({ port: PORT }, () => {
    process.stdout.write(
      ` 🚀  Server ready at http://localhost:${PORT}${apollo.graphqlPath}`
    );
  });
}
process.env.STAGE != "test" && main();
