import server from '../server';

describe('Test artwork queries', () => {
  const ARTWORKS_QUERY = `
    query Query($listArtworksAuction: Boolean) {
        listArtworks(auction: $listArtworksAuction) {
            saleType
        }
    }
`;

  const FIND_ARTWORK_QUERY = `
    query Query($findArtworkId: String!) {
      findArtwork(id: $findArtworkId) {
        title
      }
    }
  `

  it('should query only auctions ', async () => {
    const res = await server.executeOperation({
      query: ARTWORKS_QUERY,
      variables: { listArtworksAuction: true },
    });
    expect(res).toMatchSnapshot();
  });

  it('should query only fixed sales ', async () => {
    const res = await server.executeOperation({
      query: ARTWORKS_QUERY,
      variables: { listArtworksAuction: false },
    });
    expect(res).toMatchSnapshot();
  });

  it('should query both auctions and fixed', async () => {
    const res = await server.executeOperation({
      query: ARTWORKS_QUERY,
      variables: { listArtworksAuction: undefined },
    });
    expect(res).toMatchSnapshot();
  });

  it('should find an artwork by id', async () => {
    const res = await server.executeOperation({
      query: FIND_ARTWORK_QUERY,
      variables: { findArtworkId: "cku1ahnm200109q0wx8p4x2u1" },
    });
    expect(res).toMatchSnapshot();
  });

  it('should not find an artwork by id and throw an error', async () => {
    const res = await server.executeOperation({
      query: FIND_ARTWORK_QUERY,
      variables: { findArtworkId: "abc" },
    });
    expect(res).toMatchSnapshot();
  });
});
