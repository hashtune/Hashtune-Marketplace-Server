import getGlobalData from '../../utils/getGlobalData';
import reset from '../../utils/reset';
import seed from '../../utils/seed';
import server from '../server';

beforeAll(async () => {
  await reset();
  await seed();
  global.testData = await getGlobalData();
});

describe('Test artwork queries', () => {
  const ARTWORKS_QUERY = `
    query Query($listArtworksAuction: Boolean) {
        listArtworks(auction: $listArtworksAuction) {
            saleType
            handle
        }
    }
`;

  const FIND_ARTWORK_QUERY = `
    query Query($findArtworkId: String!) {
      findArtwork(id: $findArtworkId) {
        title
      }
    }
  `;

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

  it('should query only fixed sales that are listed ', async () => {
    const res = await server.executeOperation({
      query: ARTWORKS_QUERY,
      variables: { listArtworksAuction: false, listArtworksListed: true },
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
      variables: { findArtworkId: global.testData.artworks[0].id },
    });
    expect(res).toMatchSnapshot();
  });

  it('should not find an artwork by id and throw an error', async () => {
    const res = await server.executeOperation({
      query: FIND_ARTWORK_QUERY,
      variables: { findArtworkId: 'abc' },
    });
    expect(res).toMatchSnapshot();
  });
});
