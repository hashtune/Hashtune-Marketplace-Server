import getGlobalData from '../../utils/getGlobalData';
import reset from '../../utils/reset';
import seed from '../../utils/seed';
import server from '../server';

describe("test auction mutation", () => {

    let users;
    let artworks;
    let auctions;

    beforeAll(async () => {
        await reset();
        await seed();
        global.testData = await getGlobalData();
        users = global.testData.users;
        artworks = global.testData.artworks;
        auctions = global.testData.auctions;
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

    const DELETE_AUCTION_MUTATION = ` 
        mutation DeleteAuction($userId: String!, $auctionId: String!) {
            deleteAuction(userId: $userId, auctionId: $auctionId) {
                Auctions {
                    currentHigh
                }
                ClientErrorAuctionNotFound {
                    message
                }
                ClientErrorUserUnauthorized {
                    message
                }
                ClientErrorUnknown {
                    message
                }
                ClientErrorArtworkNotFound {
                    message
                }
                ClientErrorAuctionNotDeletable {
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

    const deleteAuction = async (userId, auctionId) => {
        return await server.executeOperation({
            query: DELETE_AUCTION_MUTATION, variables: {
                "userId": userId,
                "auctionId": auctionId,
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

    // delete auction tests

    it("Should not find the auction", async () => {
        const res = await deleteAuction(users[1].id, "noid");
        expect(res).toMatchSnapshot()
    })

    it("Should fail to delete an auction with bids", async () => {
        const res = await deleteAuction(users[0].id, auctions[1].id);
        expect(res).toMatchSnapshot()
    })

    it("Should fail to delete an auction for an artwork that the user doesn't own", async () => {
        const res = await deleteAuction(users[2].id, auctions[0].id);
        expect(res).toMatchSnapshot()
    })

    it("Should delete an auction with no bids", async () => {
        const res = await deleteAuction(users[1].id, auctions[0].id);
        expect(res).toMatchSnapshot()
    })
})