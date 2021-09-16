import { GraphQLFieldConfig, GraphQLFieldResolver, GraphQLList } from 'graphql';
import { Artwork } from '@prisma/client';
import { IApolloServerContext } from '@src/lib/interfaces/IApolloServerContext';
import { getAllArtworks } from '@src/data/artworkService';
import ArtworkType from '@src/graphql/schema/typedefs/ArtworkType';

export const getAllArtworksQueryResolver: GraphQLFieldResolver<
  unknown,
  IApolloServerContext
> = async (_source, _args, _context, _info): Promise<Artwork[]> => {
  const artworks = await getAllArtworks();
  return artworks;
};

const getAllArtworksQuery: GraphQLFieldConfig<unknown, IApolloServerContext> = {
  description: 'Get all artworks query',
  type: GraphQLList(ArtworkType),
  resolve: getAllArtworksQueryResolver,
};

export default getAllArtworksQuery;
