import server from '../server';

describe('Test artwork queries', () => {
  const ARTWORK_QUERY = `
    query Query($listArtworksAuction: Boolean) {
        listArtworks(auction: $listArtworksAuction) {
            saleType
        }
    }
`;

  it('should query only auctions ', async () => {
    const res = await server.executeOperation({
      query: ARTWORK_QUERY,
      variables: { listArtworksAuction: true },
    });
    expect(res).toMatchSnapshot();
  });

  it('should query both auctions and fixed', async () => {
    const res = await server.executeOperation({
      query: ARTWORK_QUERY,
      variables: { listArtworksAuction: false },
    });
    expect(res).toMatchSnapshot();
  });
});
