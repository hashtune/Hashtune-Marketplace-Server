import { ApolloServer } from 'apollo-server-express';
// import EthSigUtil from 'eth-sig-util';
import express from 'express';
import { createServer } from 'http';
import { createContext } from './context';
import { schema } from './schema';
var cors = require('cors');

console.log(process.env.SERVER_SECRET);
const cookieParser = require('cookie-parser');

const { PORT = 5000 } = process.env;

const app = express();

// TODO move to separate file ./auth/passport.c
// TODO use this passport middleware in mutations
// app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());

export const secret = process.env.SERVER_SECRET ?? '';

const server = createServer(app);

export const apollo = new ApolloServer({
  schema,
  introspection: true,
  context: createContext,
});

export async function main() {
  await apollo.start();
  apollo.applyMiddleware({ app, cors: false });
  server.listen({ port: PORT }, () => {
    process.stdout.write(
      ` 🚀  Server ready at http://localhost:${PORT}${apollo.graphqlPath}`
    );
  });
}
process.env.STAGE != 'test' && main();
