import { GraphQLResolverMap } from 'apollo-graphql';
import { User, Artwork } from '@prisma/client';
import { getUserById } from '@src/data/userService';
import { getArtworksByUser } from '@src/data/artworkService';
import { IApolloServerContext } from '@src/lib/interfaces/IApolloServerContext';
import mutation from '@src/graphql/schema/resolvers/mutation/mutation';
import query from '@src/graphql/schema/resolvers/query/query';

const resolvers: GraphQLResolverMap<IApolloServerContext> = {
  Query: query,
  Mutation: mutation,
  Artwork: {
    user(artwork: Artwork): Promise<User | null> {
      return getUserById(artwork.id);
    },
  },
  User: {
    artworks(user: User): Promise<Artwork[]> {
      return getArtworksByUser(user.id);
    },
  },
  // User: {
  //   // eslint-disable-next-line no-underscore-dangle
  //   __resolveReference(artwork, _args, context: IApolloServerContext) {
  //     console.log('calling resolveRefearance');
  //     return context.prismaContext.prisma.user.findUnique({
  //       where: {
  //         id: artwork.userId,
  //       },
  //     });
  //   },
  // },
};

export default resolvers;
