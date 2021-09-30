import server from '../server';

describe('Test users query', () => {
  const USERS_QUERY = `
    query Query {
      listCreators {
        handle
      }
    }
`;

  const FIND_USER_QUERY = `
    query Query($findUserHandle: String!) {
      findUser(handle: $findUserHandle) {
        handle
      }
    }
  `;

  it('should query the all the users', async () => {
    const res = await server.executeOperation({
      query: USERS_QUERY,
    });
    expect(res).toMatchSnapshot();
  });

  it('should find a user by slug', async () => {
    const res = await server.executeOperation({
      query: FIND_USER_QUERY,
      variables: { findUserHandle: 'user1' },
    });
    expect(res).toMatchSnapshot();
  });

  it('should not find a user by id and throw an error', async () => {
    const res = await server.executeOperation({
      query: FIND_USER_QUERY,
      variables: { findUserHandle: 'abc' },
    });
    expect(res).toMatchSnapshot();
  });
});

export {};
