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
        UserNotFound {
          message
        }
        ClientError {
          message
        }
      }
    }
`;

  const FIND_USER_QUERY = `
  query Query($findUserHandle: String!) {
    findUser(handle: $findUserHandle) {
      Users {
        handle
      }
      UserNotFound {
        message
      }
      ClientError {
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

  it('should not find a user by handle and throw an error', async () => {
    const res = await server.executeOperation({
      query: FIND_USER_QUERY,
      variables: { findUserHandle: 'hgyujghf8989y89' },
    });
    expect(res).toMatchSnapshot();
  });
});

export { };

