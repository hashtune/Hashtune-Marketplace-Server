import server from '../server';

describe('Test users query', () => {
  const ARTWORK_QUERY = `
    query Query($listArtworksAuction: Boolean) {
        listArtworks(auction: $listArtworksAuction) {
            handle
        }
    }
`;

  it('should query the users', async () => {
    const res = await server.executeOperation({
      query: ARTWORK_QUERY,
      variables: { listArtworksAuction: true },
    });
    expect(res).toMatchSnapshot();
  });
});

export {};
