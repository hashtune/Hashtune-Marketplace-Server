import { Artwork } from '@prisma/client';
import prismaContext from '@src/lib/prisma/prismaContext';

export const getAllArtworks = async (): Promise<Artwork[]> => {
  const artworks = await prismaContext.prisma.artwork.findMany();
  return artworks;
};

export const getArtworkById = async (id: string): Promise<Artwork | null> => {
  return prismaContext.prisma.artwork.findFirst({
    where: {
      id,
    },
  });
};

export const getArtworksByUser = async (id: string): Promise<Artwork[]> => {
  return prismaContext.prisma.artwork.findMany({
    where: {
      id,
    },
  });
};

export const createArtwork = async (
  title: string,
  link: string,
  handle: string,
  image: string,
  description: string,
  auctionId: string,
  likedById: string
): Promise<Artwork> => {
  const artwork = await prismaContext.prisma.artwork.create({
    data: {
      title,
      link,
      handle,
      image,
      description,
      auctionId,
      likedById,
    },
  });
  return artwork;
};
