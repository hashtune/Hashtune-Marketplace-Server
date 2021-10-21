import getGlobalData from '../../utils/getGlobalData';
import reset from '../../utils/reset';
import seed from '../../utils/seed';
import server from '../server';

describe("test auction mutation", () => {

    let users;
    let artworks;

    beforeAll(async () => {
        await reset();
        await seed();
        global.testData = await getGlobalData();
        users = global.testData.users;
        artworks = global.testData.artworks;
    });

    const ADD_AUCTION_MUTATION = `
        mutation addAuction2($inputType: AddAuctionInput) {
            addAuction(InputType: $inputType) {
                Auctions {
                    currentHigh
                }
                ClientErrorArtworkNotFound {
                    message
                }
                ClientErrorUserUnauthorized {
                    message
                }
                ClientErrorUnknown {
                    message
                }
                ClientErrorArtworkAlreadyExists {
                    message
                }
                ClientErrorArtworkNotAnAuction {
                    message
                }
            }
        }
    `


    const createAuction = async (userId, artworkId) => {
        return await server.executeOperation({
            query: ADD_AUCTION_MUTATION, variables: {
                "inputType": {
                    "userId": userId,
                    "artworkId": artworkId,
                    "live": true
                }
            }
        })
    }

    it("Should create a new auction", async () => {
        const res = await createAuction(users[1].id, artworks[0].id);
        expect(res).toMatchSnapshot()
    })

    it("Shouldn't let an unauthorized user create a new auction", async () => {
        const res = await createAuction(users[1].id, artworks[1].id);
        expect(res).toMatchSnapshot()
    })

    it("should fail because it cannot find the id", async () => {
        const res = await createAuction(users[1].id, "noid");
        expect(res).toMatchSnapshot()
    })

    it("Should not create a new auction for this artwork because one already exists", async () => {
        const res = await createAuction(users[0].id, artworks[3].id);
        expect(res).toMatchSnapshot()
    })
})