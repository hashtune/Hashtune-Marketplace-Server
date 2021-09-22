import server from '../server';

describe('Test users query', () => {


  const USER_QUERY = `
    query Query {
      listTrendyCreators {
        handle
      }
    }
`;

  // TODO actually return data
  it('should query the trending users', async () => {
    const res = await server.executeOperation({
      query: USER_QUERY,
    });
    expect(res).toMatchSnapshot();
  });
});

export { };

