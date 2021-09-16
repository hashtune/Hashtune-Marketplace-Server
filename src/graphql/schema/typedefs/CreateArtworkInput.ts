import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

const CreateArtworkkInput: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'CreateArtworkInput',
  description: 'Create Artwork input',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The Artworks title.',
    },
    userId: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The users id.',
    },
  },
});

export default CreateArtworkkInput;
