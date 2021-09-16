import { getAllArtworksQueryResolver } from '@src/graphql/schema/resolvers/query/getAllArtworksQuery';
import { getAllUsersResolver } from '@src/graphql/schema/resolvers/query/getAllUsersQuery';

const query = {
  artworks: {
    resolve: getAllArtworksQueryResolver,
  },
  users: {
    resolve: getAllUsersResolver,
  },
};

export default query;
