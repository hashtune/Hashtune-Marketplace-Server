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
    query Query($listArtworksListed: Boolean, $listArtworksAuction: Boolean) {
      listArtworks(listed: $listArtworksListed, auction: $listArtworksAuction) {
        Artworks {
          saleType
          handle
        }
        ClientErrorArtworkNotFound {
          message
        }
        ClientErrorArgumentsConflict {
          message
          path
        }
        ClientErrorUserUnauthorized {
          message
        }
        ClientErrorUnknown {
          message
        }
      }
    }
`;

  const FIND_ARTWORK_QUERY = `
    query Query($findArtworkHandle: String!) {
      findArtwork(handle: $findArtworkHandle) {
        Artworks {
          title
        }
        ClientErrorArtworkNotFound {
          message
        }
        ClientErrorArgumentsConflict {
          message
          path
        }
        ClientErrorUserUnauthorized {
          message
        }
        ClientErrorUnknown {
          message
        }
      }
    }
  `;

  const CHECK_HANDLE_FREE = `
  query Query($handleHandle: String) {
    handle(handle: $handleHandle)
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

  it('should find an artwork by handle', async () => {
    const res = await server.executeOperation({
      query: FIND_ARTWORK_QUERY,
      variables: { findArtworkHandle: global.testData.artworks[0].handle },
    });
    expect(res).toMatchSnapshot();
  });

  it('should not find an artwork by handle and throw an error', async () => {
    const res = await server.executeOperation({
      query: FIND_ARTWORK_QUERY,
      variables: { findArtworkHandle: 'abc' },
    });
    expect(res).toMatchSnapshot();
  });

  it('should return false if a handle is not available', async () => {
    const res = await server.executeOperation({
      query: CHECK_HANDLE_FREE,
      variables: { handleHandle: '1' },
    });
    expect(res).toMatchSnapshot();
  });
  it('should return true if a handle is available', async () => {
    const res = await server.executeOperation({
      query: CHECK_HANDLE_FREE,
      variables: { handleHandle: 'askfjlsakfjslka' },
    });
    expect(res).toMatchSnapshot();
  });

  it('should never return a pending artwork in a findUnique or findMany query', async () => {
    const res = await server.executeOperation({
      query: ARTWORKS_QUERY,
      variables: { listArtworksAuction: undefined },
    });
    expect(res).toMatchSnapshot();
  });
});
