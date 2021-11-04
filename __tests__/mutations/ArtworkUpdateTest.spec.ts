import chain from '../../singletons/chain';
import getGlobalData from '../../utils/getGlobalData';
import reset from '../../utils/reset';
import seed from '../../utils/seed';
import server from '../server';

describe('Test artwork update mutation', () => {
    chain.checkSuccessLog = jest.fn();

    let users;
    let artworks;
    let auctions;

    beforeAll(async () => {
        await reset();
        await seed();
        global.testData = await getGlobalData();
        users = await global.testData.users;
        artworks = await global.testData.artworks;
        auctions = await global.testData.auctions;
    });

    const UPDATE_ARTWORK_MUTATION = `
    mutation UpdateArtwork($inputType: UpdateArtworkInput) {
        updateArtwork(InputType: $inputType) {
          Artworks {
            reservePrice
            price
            kind
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
          ExternalChainError {
            message
          }
          ExternalChainErrorStillPending {
            message
          }
        }
      }
    `

    const updateAuction = async (artworkId: string, userId: string, salePrice: undefined | number = undefined, reservePrice: undefined | number = undefined) => {
        return await server.executeOperation({
            query: UPDATE_ARTWORK_MUTATION, variables: {
                inputType: {
                    txHash: "000000",
                    artworkId,
                    userId,
                    salePrice,
                    reservePrice
                }
            }
        })
    }

    it("Should update the reservePrice", async () => {
        const res = await updateAuction(artworks[0].id, users[1].id, undefined, 13)
        expect(res).toMatchSnapshot()
    })

    it("Should throw an error because price is not specified for a fixed sale", async () => {
        const res = await updateAuction(artworks[4].id, users[1].id, undefined, undefined)
        expect(res).toMatchSnapshot()
    })

    it("Should update the price", async () => {
        const res = await updateAuction(artworks[4].id, users[0].id, 80, undefined)
        expect(res).toMatchSnapshot()
    })

    it("Should throw an error because the user is not the owner of the Artwork", async () => {
        const res = await updateAuction(artworks[4].id, users[2].id, 10, undefined)
        expect(res).toMatchSnapshot()
    })
})