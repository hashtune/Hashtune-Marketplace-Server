import { LogDescription } from 'ethers/lib/utils';
import chain from '../../singletons/chain';
import forgeJWT from '../../utils/forgeJWT';
import getGlobalData from '../../utils/getGlobalData';
import reset from '../../utils/reset';
import seed from '../../utils/seed';
import server from '../server';
describe('Test artwork mutations', () => {
  // Mock external service
  chain.checkSuccessLog = jest.fn(
    async () => await Promise.resolve({} as LogDescription)
  );
  // TODO move this setup to the globals object
  let user1;
  let user1Token;
  let user3;
  let user3Token;
  beforeAll(async () => {
    await reset();
    await seed();
    global.testData = await getGlobalData();
    user1 = global.testData.users.filter(u => u.handle === 'user1')[0];
    user3 = global.testData.users.filter(u => u.handle === 'user3')[0];
    user1Token = {
      req: {
        headers: {
          jwt: await forgeJWT(user1),
        },
      },
    };
    user3Token = {
      req: {
        headers: {
          jwt: await forgeJWT(user3),
        },
      },
    };
  });

  const ADD_ARTWORK_MUTATION = `
    mutation Mutation($addArtworkInputType: CreateArtworkInput) {
      addArtwork(InputType: $addArtworkInputType) {
        Artworks {
          title
          description
          saleType
          txHash
          pending
          reservePrice
          price
          Auctions {
            currentHigh
          }
          creator {
            fullName
          }
          owner {
            fullName
          }
        }
        ClientErrorArtworkNotFound {
          message
        }
        ClientErrorArgumentsConflict {
          message
          path
        }
        ClientErrorUserUnauthorized {
          message
        }
        ClientErrorUnknown {
          message
        }
        ExternalChainErrorStillPending {
          message
        }
        ExternalChainError {
          message
        }
      }
    }`;

  const exampleArgs = {
    txHash: '123',
    handle: 'something',
    title: 'strstrstr',
    image: 'Sun',
    description: 'Art',
    link: 'a.rt/',
    media: { data: [{ media: 'lala', title: 'amazingsongTitle' }] },
  };

  it('should create an artwork', async () => {
    const res = await server.executeOperation(
      {
        query: ADD_ARTWORK_MUTATION,
        variables: {
          addArtworkInputType: {
            ...exampleArgs,
            handle: 'something1',
            currentOwner: user1.id,
            creator: user1.id,
            saleType: 'auction',
            reservePrice: 50,
          },
        },
      },
      user1Token
    );
    expect(res).toMatchSnapshot();
  });

  it('should create an artwork without an auction if fixed sale is specified', async () => {
    const res = await server.executeOperation(
      {
        query: ADD_ARTWORK_MUTATION,
        variables: {
          addArtworkInputType: {
            ...exampleArgs,
            handle: 'something2',
            currentOwner: user1.id,
            creator: user1.id,
            saleType: 'fixed',
            salePrice: 50,
          },
        },
      },
      user1Token
    );
    expect(res).toMatchSnapshot();
  });

  it('should create an artwork with no reserve price of auction is specified and reserve price is 0', async () => {
    const res = await server.executeOperation(
      {
        query: ADD_ARTWORK_MUTATION,
        variables: {
          addArtworkInputType: {
            ...exampleArgs,
            handle: 'something3',
            currentOwner: user1.id,
            creator: user1.id,
            saleType: 'auction',
            reservePrice: 0,
          },
        },
      },
      user1Token
    );
    expect(res).toMatchSnapshot();
  });

  it('should fail to create an artwork because the user is not an approved creator', async () => {
    const unapprovedCreator = global.testData.users[2];
    const res = await server.executeOperation(
      {
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
      },
      user3Token
    );
    expect(res).toMatchSnapshot();
  });

  it('should fail to create an artwork with fixed sale type and reserve price set', async () => {
    const res = await server.executeOperation(
      {
        query: ADD_ARTWORK_MUTATION,
        variables: {
          addArtworkInputType: {
            ...exampleArgs,
            currentOwner: user1.id,
            creator: user1.id,
            saleType: 'fixed',
            reservePrice: 50,
          },
        },
      },
      user1Token
    );
    expect(res).toMatchSnapshot();
  });
});

export {};
