import getGlobalData from '../../utils/getGlobalData';
import reset from '../../utils/reset';
import seed from '../../utils/seed';
import server from '../server';

beforeAll(async () => {
  await reset();
  await seed();
  global.testData = await getGlobalData();
});

describe('Test users query', () => {
  const USERS_QUERY = `
    query Query {
      listCreators {
        Users {
          handle
        }
        ClientErrorUserNotFound {
          message
        }
        ClientErrorUnknown {
          message
        }
      }
    }
`;

  const FIND_USER_QUERY = `
  query Query($findUserHandle: String, $findUserPublicKey: String) {
    findUser(handle: $findUserHandle, publicKey: $findUserPublicKey) {
      Users {
        handle
      }
      ClientErrorUserNotFound {
        message
      }
      ClientErrorUnknown {
        message
      }
    }
  }
  `;

  it('should query the all the users', async () => {
    const res = await server.executeOperation({
      query: USERS_QUERY,
    });
    expect(res).toMatchSnapshot();
  });

  it('should find a user by handle', async () => {
    const res = await server.executeOperation({
      query: FIND_USER_QUERY,
      variables: { findUserHandle: global.testData.users[0].handle },
    });
    expect(res).toMatchSnapshot();
  });

  it('should not find a user if no arguments are passed in', async () => {
    const res = await server.executeOperation({
      query: FIND_USER_QUERY,
      variables: {},
    });
    expect(res).toMatchSnapshot();
  });

  it('should not find a user by handle if it does not exist', async () => {
    const res = await server.executeOperation({
      query: FIND_USER_QUERY,
      variables: { findUserHandle: 'hgyujghf8989y89' },
    });
    expect(res).toMatchSnapshot();
  });

  it('should find a user if the publicKey is valid', async () => {
    const res = await server.executeOperation({
      query: FIND_USER_QUERY,
      variables: { findUserPublicKey: global.testData.wallets[0].publicKey },
    });
    expect(res).toMatchSnapshot();
  });
});

export {};
