import { prisma } from '../../singletons/prisma';
import getGlobalData from '../../utils/getGlobalData';
import reset from '../../utils/reset';
import seed from '../../utils/seed';
import server from '../server';

describe('Test artwork mutations', () => {

  beforeAll(async () => {
    await reset();
    await seed();
    global.testData = await getGlobalData();
  });

  const ADD_ARTWORK_MUTATION = `
    mutation Mutation($addArtworkInputType: CreateArtworkInput) {
      addArtwork(InputType: $addArtworkInputType) {
        Artworks {
          title
          description
          saleType
          creator {
            fullName
          }
          owner {
            fullName
          }
        }
        ArtworkNotFound {
          message
        }
        ArtworkArgumentsConflict {
          message
          path
        }
        UserUnauthorized {
          message
        }
        ClientError {
          message
        }
      }
    }`;

  const exampleArgs = {
    handle: 'something',
    title: 'strstrstr',
    image: 'Sun',
    description: 'Art',
    link: 'a.rt/',
    media: { data: [{ media: 'lala', title: 'amazingsongTitle' }] },
  };

  it('should create an artwork', async () => {
    const user1 = global.testData.users.filter(u => u.handle === 'user1')[0];
    const res = await server.executeOperation({
      query: ADD_ARTWORK_MUTATION,
      variables: {
        addArtworkInputType: {
          ...exampleArgs,
          currentOwner: user1.id,
          creator: user1.id,
          saleType: 'auction',
          reservePrice: 50,
        }
      }
    });
    const artwork = await prisma.artwork.findUnique({
      where: {
        handle: "something"
      }
    });
    if (!artwork) throw new Error('Error fetching the created artwork');
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

});

export { };

