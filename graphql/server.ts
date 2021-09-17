import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import express from 'express';
import { createContext } from './context';
import { schema } from './schema';
const { PORT = 5000 } = process.env;

async function main() {
  const app = express();
  const server = createServer(app);
  const apollo = new ApolloServer({
    schema,
    introspection: true,
    apollo: {},
    context: createContext,
  });
  await apollo.start();
  apollo.applyMiddleware({ app });
  // This doesn't log for some reason
  server.listen({ port: PORT }),
    () => {
      process.stdout.write(
        ` 🚀  Server ready at http://localhost:${PORT}${apollo.graphqlPath}graphql`
      );
    };
}
main();
