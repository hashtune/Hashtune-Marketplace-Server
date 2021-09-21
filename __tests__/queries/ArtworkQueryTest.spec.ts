import { ApolloServer } from 'apollo-server';
import { createContext } from '../../graphql/context';
import { schema } from '../../graphql/schema';

const server = new ApolloServer({
  schema,
  introspection: true,
  apollo: {},
  context: createContext,
});

const ARTWORK_QUERY = `
    query Query($listArtworksAuction: Boolean) {
        listArtworks(auction: $listArtworksAuction) {
            handle
        }
    }
`;

describe('Test users query', () => {
  it('should query the users', async () => {
    const res = await server.executeOperation({
      query: ARTWORK_QUERY,
      variables: { listArtworksAuction: true },
    });
    expect(res).toMatchSnapshot();
  });
});

export {};
