import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import depthLimit from 'graphql-depth-limit';
import { createServer } from 'http';
import { createContext } from './context';
import { schema } from './schema';
import helmet from "helmet";

const { PORT = 5000 } = process.env;

const app = express();
app.use(helmet());

const server = createServer(app);

const corsOptions = {
  origin: ["http://localhost:5000", "http://localhost:3000"],
  credentials: true
}

export const apollo = new ApolloServer({
  schema,
  introspection: process.env.STAGE !== "production",
  apollo: {},
  context: createContext,
  validationRules: [depthLimit(5)]
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
process.env.STAGE != "test" && main();
