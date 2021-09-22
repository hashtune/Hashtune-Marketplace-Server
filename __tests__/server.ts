import { ApolloServer } from 'apollo-server-express';
import { createContext } from '../graphql/context';
import { schema } from '../graphql/schema';

const server = new ApolloServer({
  schema,
  introspection: true,
  apollo: {},
  context: createContext,
});

export default server;
