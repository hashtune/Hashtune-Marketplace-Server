import { User } from '@prisma/client';
import { prisma } from '../../singletons/prisma';
import reset from '../../utils/reset';
import seed from '../../utils/seed';
import server from '../server';

describe('Test artwork mutations', () => {
  let createdId: string;
  let creatorId: string;
  beforeAll(async () => {
    await reset();
    await seed();
  });

  const ADD_ARTWORK_MUTATION = `
        mutation AddArtwork($addArtworkInputType: CreateArtworkInput) {
            addArtwork(InputType: $addArtworkInputType) {
                title
                description
                saleType
                creator {
                    fullName
                }
            }
        }
    `;

  const DELETE_ARTWORK_MUTATION = `
        mutation DeleteArtworkMutation($deleteArtworkArtworkId: String!, $deleteArtworkUserId: String!) {
            deleteArtwork(artworkId: $deleteArtworkArtworkId, userId: $deleteArtworkUserId) {
                title
                description
                listed
            }
        }
        `;

  const exampleArgs = {
    handle: 'something',
    title: 'strstrstr',
    image: 'Sun',
    description: 'Art',
    link: 'a.rt/',
    media: { data: [{ media: 'lala', title: 'amazingsongTitle' }] },
  };

  it('should create an artwork', async () => {
    const approvedCreators: User[] = await prisma.user.findMany({
      where: {
        isApprovedCreator: true,
      },
    });
    // TODO: Attach all users to the global jest context for easier access
    if (!approvedCreators) throw new Error('Error fetching the test user');
    const res = await server.executeOperation({
      query: ADD_ARTWORK_MUTATION,
      variables: {
        addArtworkInputType: {
          ...exampleArgs,
          currentOwner: approvedCreators[0].id,
          creator: approvedCreators[0].id,
          saleType: 'auction',
          reservePrice: 50,
        },
      },
    });
    const artwork = await prisma.artwork.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
    if (!artwork) throw new Error('Error fetching the created artwork');
    createdId = artwork[0].id;
    creatorId = approvedCreators[0].id;
    expect(res).toMatchSnapshot();
  });

  it('should fail to create an artwork because the user is not an approved creator', async () => {
    const unapprovedCreator: User | null = await prisma.user.findUnique({ where: { handle: 'user3' } });
    if (!unapprovedCreator) throw new Error('Error fetching the test user');
    const res = await server.executeOperation({
      query: ADD_ARTWORK_MUTATION,
      variables: {
        addArtworkInputType: {
          ...exampleArgs,
          currentOwner: unapprovedCreator.id,
          creator: unapprovedCreator.id,
          saleType: 'auction',
          reservePrice: 50,
        },
      },
    });
    expect(res).toMatchSnapshot()
  });

  it('should fail to create an artwork with fixed sale type and reserve price set', async () => {
    const approvedCreators: User[] = await prisma.user.findMany({});
    if (!approvedCreators) throw new Error('Error fetching the test user');
    const res = await server.executeOperation({
      query: ADD_ARTWORK_MUTATION,
      variables: {
        addArtworkInputType: {
          ...exampleArgs,
          currentOwner: approvedCreators[0].id,
          creator: approvedCreators[0].id,
          saleType: 'fixed',
          reservePrice: 50,
        },
      },
    });
    expect(res).toMatchSnapshot();
  });

  it('should delete an artork with an existing id', async () => {
    const approvedCreators: User[] = await prisma.user.findMany({
      where: {
        isApprovedCreator: true,
      },
    });
    if (!approvedCreators) throw new Error("Error fetching the test user")
    const res = await server.executeOperation({
      query: DELETE_ARTWORK_MUTATION,
      variables: {
        deleteArtworkArtworkId: createdId,
        deleteArtworkUserId: creatorId,
      },
    });
    expect(res).toMatchSnapshot();
  });

  it('should try to delete an artork that doesn\'t exist', async () => {
    const res = await server.executeOperation({
      query: DELETE_ARTWORK_MUTATION,
      variables: {
        deleteArtworkArtworkId: "artworkId",
        deleteArtworkUserId: "-",
      },
    });
    expect(res).toMatchSnapshot();
  });

  it('should try to delete an artwork that the user does not own and did not create', async () => {
    const user: User | null = await prisma.user.findUnique({ where: { handle: 'user3' } });
    const artwork = await prisma.artwork.findUnique({ where: { handle: '4' } });
    if (!user || !artwork) throw new Error("Error fetching the data");
    const res = await server.executeOperation({
      query: DELETE_ARTWORK_MUTATION,
      variables: {
        deleteArtworkArtworkId: artwork.id,
        deleteArtworkUserId: user.id,
      },
    });
    expect(res).toMatchSnapshot();
  })

  it('should try to delete an artwork that the user does not own and created', async () => {
    const user: User | null = await prisma.user.findUnique({ where: { handle: 'user2' } });
    const artwork = await prisma.artwork.findUnique({ where: { handle: '3' } });
    if (!user || !artwork) throw new Error("Error fetching the data");
    const res = await server.executeOperation({
      query: DELETE_ARTWORK_MUTATION,
      variables: {
        deleteArtworkArtworkId: artwork.id,
        deleteArtworkUserId: user.id,
      },
    });
    expect(res).toMatchSnapshot();
  })
});

export { };

