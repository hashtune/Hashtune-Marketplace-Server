import { prisma } from '../../singletons/prisma';
import reset from '../../utils/reset';
import seed from '../../utils/seed';
import server from '../server';

beforeAll(async () => {
  await reset();
  await seed();
});

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
  `;

  it('should query the all the users', async () => {
    const res = await server.executeOperation({
      query: USERS_QUERY,
    });
    expect(res).toMatchSnapshot();
  });

  it('should find a user by id', async () => {
    const userId = await prisma.user.findMany({});
    const res = await server.executeOperation({
      query: FIND_USER_QUERY,
      variables: { findUserId: userId[0].id },
    });
    expect(res).toMatchSnapshot();
  });

  it('should not find a user by id and throw an error', async () => {
    const res = await server.executeOperation({
      query: FIND_USER_QUERY,
      variables: { findUserId: 'abc' },
    });
    expect(res).toMatchSnapshot();
  });
});

export {};
