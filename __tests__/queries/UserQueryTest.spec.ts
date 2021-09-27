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
    query Query($findUserId: String!) {
      findUser(id: $findUserId) {
        handle
      }
    }
  `

  it('should query the all the users', async () => {
    const res = await server.executeOperation({
      query: USERS_QUERY,
    });
    expect(res).toMatchSnapshot();
  });

  it('should find a user by id', async () => {
    const res = await server.executeOperation({
      query: FIND_USER_QUERY,
      variables: { findUserId: "cku10kd240000sm0wostud3r8" }
    });
    expect(res).toMatchSnapshot();
  });

  it('should not find a user by id and throw an error', async () => {
    const res = await server.executeOperation({
      query: FIND_USER_QUERY,
      variables: { findUserId: "abc" }
    });
    expect(res).toMatchSnapshot();
  });
});

export { };

