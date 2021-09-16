import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';

const CreateUserInput: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  description: 'Create user input',
  fields: {
    fullName: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The users handle',
    },
  },
});

export default CreateUserInput;
