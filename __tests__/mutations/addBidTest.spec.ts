import getGlobalData from '../../utils/getGlobalData';
import reset from '../../utils/reset';
import seed from '../../utils/seed';
import server from '../server';

describe("test bids mutations", () => {
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

    const ADD_BID_MUTATION = `
    mutation Mutation($inputType: AddBidInput) {
        addBid(InputType: $inputType) {
          Bids {
            offer
          }
         
          ClientErrorArgumentsConflict {
            message
          }
          ClientErrorUserUnauthorized {
            message
          }
          ClientErrorUnknown {
            message
          }
          ClientErrorAuctionNotFound {
            message
          }
          ClientErrorAuctionNotLive {
            message
          }
        }
      }
    `
    const createBid = async (userId, auctionId, offer) => {
        return await server.executeOperation({
            query: ADD_BID_MUTATION, variables: {
                "inputType": {
                    "userId": userId,
                    "auctionId": auctionId,
                    "offer": offer
                }
            }
        })
    };

    it("Should fail to create a bid because the user is the owner", async () => {
        const res = await createBid(users[1].id, auctions[0].id, 20);
        expect(res).toMatchSnapshot()
    })

    it("Should fail to create a bid on an auction that is not live", async () => {
        const res = await createBid(users[2].id, auctions[0].id, 20);
        expect(res).toMatchSnapshot()
    })

    it("Should fail to create a bid lower than the current high", async () => {
        const res = await createBid(users[2].id, auctions[1].id, 20);
        expect(res).toMatchSnapshot()
    })

    it("Should make a bid", async () => {
        const res = await createBid(users[2].id, auctions[1].id, 40);
        expect(res).toMatchSnapshot()
    })
})