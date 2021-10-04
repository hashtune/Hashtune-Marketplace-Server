import { prisma } from '../../singletons/prisma';
import getGlobalData from '../../utils/getGlobalData';
import reset from '../../utils/reset';
import seed from '../../utils/seed';
import server from '../server';

describe('Test artwork mutations', () => {

  let createdId: string;
  let creatorId: string;

  beforeAll(async () => {
    await reset();
    await seed();
    global.testData = await getGlobalData();
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
    const approvedCreator = global.testData.users[0];
    const res = await server.executeOperation({
      query: ADD_ARTWORK_MUTATION,
      variables: {
        addArtworkInputType: {
          ...exampleArgs,
          currentOwner: approvedCreator.id,
          creator: approvedCreator.id,
          saleType: 'auction',
          reservePrice: 50,
        },
      },
    });
    const artwork = await prisma.artwork.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      take: 1
    });
    if (!artwork) throw new Error('Error fetching the created artwork');
    createdId = artwork[0].id;
    creatorId = approvedCreator.id;
    expect(res).toMatchSnapshot();
  });

  it('should fail to create an artwork because the user is not an approved creator', async () => {
    const unapprovedCreator = global.testData.users[2];
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
    const approvedCreator = global.testData.users[0];
    const res = await server.executeOperation({
      query: ADD_ARTWORK_MUTATION,
      variables: {
        addArtworkInputType: {
          ...exampleArgs,
          currentOwner: approvedCreator.id,
          creator: approvedCreator.id,
          saleType: 'fixed',
          reservePrice: 50,
        },
      },
    });
    expect(res).toMatchSnapshot();
  });

  it('should delete an artork with an existing id', async () => {
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
    const user = global.testData.users[2];
    const artwork = global.testData.artworks[4];
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
    const user = global.testData.users[1];
    const artwork = global.testData.artworks[3];
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

