import { GraphQLFieldConfig, GraphQLFieldResolver } from 'graphql';
import { User } from '@prisma/client';
import { IApolloServerContext } from '@src/lib/interfaces/IApolloServerContext';
import { createUser } from '@src/data/userService';
import UserType from '@src/graphql/schema/typedefs/UserType';
import CreateUserInput from '@src/graphql/schema/typedefs/CreateUserInput';

export const createUserMutationResolver: GraphQLFieldResolver<
  unknown,
  IApolloServerContext
> = async (
  _source,
  { input: { fullName } },
  _context,
  _info
): Promise<User> => {
  return createUser(fullName);
};

const createUserMutation: GraphQLFieldConfig<unknown, IApolloServerContext> = {
  description: 'create user',
  type: UserType,
  args: {
    input: {
      type: CreateUserInput,
    },
  },
  resolve: createUserMutationResolver,
};

export default createUserMutation;
