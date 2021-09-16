/* eslint-disable no-underscore-dangle */
import { ApolloServer, gql } from 'apollo-server';
import apolloServerConfig from '@src/lib/config/apolloServerConfig';
import { CreateArtworkInput } from '@src/graphql/generated/graphql';
import prismaContext from '@src/lib/prisma/prismaContext';

const CREATE_ARTWORK_MUTATION = gql`
  mutation CreateArtwork($input: CreateArtworkInput!) {
    CreateArtwork(input: $input) {
      __typename
      id
      title
    }
  }
`;

describe('tests', () => {
  let server: ApolloServer;
  const typename = 'Artwork';

  beforeAll(() => {
    server = new ApolloServer(apolloServerConfig);
  });

  afterAll(async () => {
    prismaContext.prisma.artwork.deleteMany();
    await prismaContext.prisma.$disconnect();
  });

  it('should pass', async () => {
    const mockArtwork: CreateArtworkInput = {
      title: 'Hey moon',
    };

    const result = await server.executeOperation({
      query: CREATE_ARTWORK_MUTATION,
      variables: { input: mockArtwork },
    });

    expect(result.data).toBeDefined();
    expect(result?.data?.createArtwork).toBeDefined();
    const createdArtwork = result?.data?.createArtwork;
    expect(createdArtwork.__typename).toBe(typename);
    expect(createdArtwork.artworkId).toBeDefined();
    expect(createdArtwork.title).toBe(mockArtwork.title);
  });
});
