import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
} from 'graphql';
// eslint-disable-next-line import/no-cycle
import UserType from '@src/graphql/schema/typedefs/UserType';

const ArtworkType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Artwork',
  description: 'An artwork',
  // thunk to refer to user type
  fields: () => ({
    artworkId: {
      type: GraphQLNonNull(GraphQLID),
      description: 'id of the Artwork',
    },
    title: {
      type: GraphQLString,
      description: 'title of Artwork',
    },
    user: {
      type: UserType,
      description: 'User of an Artwork',
    },
    userId: {
      type: GraphQLInt,
      description: 'id of the user',
    },
  }),
});

export default ArtworkType;
