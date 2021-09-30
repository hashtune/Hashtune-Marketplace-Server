import { User } from '@prisma/client';
import { prisma } from '../../singletons/prisma';
import reset from '../../utils/reset';
import seed from '../../utils/seed';
import server from '../server';

describe('Test artwork mutations', () => {
  let createdId: string;
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
        mutation DeleteArtworkMutation($deleteArtworkId: String!) {
            deleteArtwork(id: $deleteArtworkId) {
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
    const approvedCreators: User[] = await prisma.user.findMany({});
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
    expect(res).toMatchSnapshot();
  });

  // TODO: Add test for non approved creator
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
    const res = await server.executeOperation({
      query: DELETE_ARTWORK_MUTATION,
      variables: {
        deleteArtworkId: createdId,
      },
    });
    expect(res).toMatchSnapshot();
  });
  // TODO: Test for trying to delete an artwork that doesn't exist
  // TODO: Test for trying to delete an artwork that the user doesnt own and did not create
});

export {};
