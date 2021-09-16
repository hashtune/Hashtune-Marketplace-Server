/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLFieldConfig, GraphQLFieldResolver } from 'graphql';
import { Artwork } from '@prisma/client';
import { IApolloServerContext } from '@src/lib/interfaces/IApolloServerContext';
import { createArtwork } from '@src/data/artworkService';
import ArtworkType from '@src/graphql/schema/typedefs/ArtworkType';
import CreateArtworkInput from '@src/graphql/schema/typedefs/CreateArtworkInput';

export const createArtworkMutationResolver: GraphQLFieldResolver<
  unknown,
  IApolloServerContext
> = async (
  _source,
  { input: { title, link, handle, image, description, auctionId, likedById } },
  _context,
  _info
): Promise<Artwork> => {
  return createArtwork(
    title,
    link,
    handle,
    image,
    description,
    auctionId,
    likedById
  );
};

const createArtworkMutation: GraphQLFieldConfig<unknown, IApolloServerContext> =
  {
    description: 'Create Artwork',
    type: ArtworkType,
    args: {
      input: {
        type: CreateArtworkInput,
      },
    },
    resolve: createArtworkMutationResolver,
  };

export default createArtworkMutation;
