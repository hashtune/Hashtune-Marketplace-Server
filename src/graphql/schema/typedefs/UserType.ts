import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} from 'graphql';
// eslint-disable-next-line import/no-cycle
import ArtworkType from '@src/graphql/schema/typedefs/ArtworkType';

const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'user',
  description: 'A user',
  // thunk for cyclical horribly documented
  fields: () => ({
    userId: {
      type: GraphQLNonNull(GraphQLID),
      description: 'id of the user',
    },
    fullName: {
      type: GraphQLString,
      description: 'users fullname',
    },
    artworks: {
      type: GraphQLList(ArtworkType),
      description: 'list of users artworks',
    },
  }),
});

export default UserType;
