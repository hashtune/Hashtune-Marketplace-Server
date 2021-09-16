import { GraphQLObjectType } from 'graphql';
import getAllUsersQuery from '@src/graphql/schema/resolvers/query/getAllUsersQuery';
import getAllArtworksQuery from '@src/graphql/schema/resolvers/query/getAllArtworksQuery';

const queryType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    artworks: getAllArtworksQuery,
    users: getAllUsersQuery,
  },
});

export default queryType;
