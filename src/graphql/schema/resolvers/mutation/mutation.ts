import { createArtworkMutationResolver } from '@src/graphql/schema/resolvers/mutation/createArtworkMutation';
import { createUserMutationResolver } from '@src/graphql/schema/resolvers/mutation/createUserMutation';

const mutation = {
  createArtwork: {
    resolve: createArtworkMutationResolver,
  },
  createUser: {
    resolve: createUserMutationResolver,
  },
};

export default mutation;
