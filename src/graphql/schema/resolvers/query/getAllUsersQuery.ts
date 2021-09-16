import { GraphQLFieldConfig, GraphQLFieldResolver, GraphQLList } from 'graphql';
import { User } from '@prisma/client';
import { IApolloServerContext } from '@src/lib/interfaces/IApolloServerContext';
import { getAllUsers } from '@src/data/userService';
import UserType from '@src/graphql/schema/typedefs/UserType';

export const getAllUsersResolver: GraphQLFieldResolver<
  unknown,
  IApolloServerContext
> = async (_source, _args, _context, _info): Promise<User[]> => {
  const users = await getAllUsers();
  return users;
};

const getAllUsersQuery: GraphQLFieldConfig<unknown, IApolloServerContext> = {
  description: 'Get all users query',
  type: GraphQLList(UserType),
  resolve: getAllUsersResolver,
};

export default getAllUsersQuery;
