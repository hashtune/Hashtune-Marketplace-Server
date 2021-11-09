import { extendType, inputObjectType } from 'nexus';
import { Context } from '../../../context';

const InputType = inputObjectType({
    name: 'AddBidInput',
    description: 'Bid input',
    definition(t) {
        t.nonNull.string("userId")
        t.nonNull.string("auctionId");
        t.nonNull.field('offer', { type: 'BigInt' });
    },
});

const newErr = (errorName: string, message: string) => {
    return { [errorName]: { message } }
}

export const addBid = extendType({
    type: "Mutation",
    definition(t) {
        t.field('addBid', {
            type: "BidResult",
            description: "add a bid for an auction",
            args: { InputType },
            resolve: async (_, args, ctx: Context) => {
                args = args.InputType;

                const auctionData = await ctx.prisma.auction.findUnique({ where: { id: args.auctionId } });
                if (!auctionData) return newErr(`ClientErrorAuctionNotFound`, `Couldn't find the auction`);
                const artworkData = await ctx.prisma.artwork.findUnique({ where: { id: auctionData.artworkId } });
                if (!artworkData) return newErr(`ClientErrorUnknown`, `Error retrieving artwork information`);
                //TODO authenticate the user
                if (artworkData.ownerId === args.userId) {
                    return newErr(`ClientErrorUserUnauthorized`, `the owner cannot make bids`)
                }
                if (auctionData.live === false) {
                    return newErr(`ClientErrorAuctionNotLive`, `You cannot make bids on an auction that is not live`)
                }
                if (auctionData.currentHighBidder === args.userId) {
                    return newErr(`ClientErrorUserUnauthorized`, `You cannot make bids if you are already the current high bidder`)
                }
                if (auctionData.currentHigh >= args.offer) {
                    return newErr(`ClientErrorArgumentsConflict`, `Your bid is lower than the current high`)
                }
                const res = await ctx.prisma.bid.create({ data: { auctionId: args.auctionId, offer: args.offer, userId: args.userId } })
                if (res) {
                    const updatedAuction = await ctx.prisma.auction.update({
                        where: {
                            id: args.auctionId
                        },
                        data: {
                            currentHigh: args.offer,
                            currentHighBidder: args.userId
                        }
                    })
                    if (!updatedAuction) return newErr(`ClientErrorUnknown`, `Error while creating the bid`)
                    return { "Bids": [res] }
                } else {
                    return newErr(`ClientErrorUnknown`, `Error while creating the bid`)
                }
            }
        }
        )
    }
})