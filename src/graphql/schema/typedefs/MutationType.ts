import { GraphQLObjectType } from 'graphql';
import createUserMutation from '@src/graphql/schema/resolvers/mutation/createUserMutation';
import createArtworkMutation from '@src/graphql/schema/resolvers/mutation/createArtworkMutation';

const mutationType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createArtwork: createArtworkMutation,
    createUser: createUserMutation,
  },
});

export default mutationType;
