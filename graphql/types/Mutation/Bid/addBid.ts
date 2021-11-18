import { extendType, inputObjectType } from 'nexus';
import { createBidEvent } from '../../../../constants';
import chain from '../../../../singletons/chain';
import { Context } from '../../../context';

const InputType = inputObjectType({
    name: 'AddBidInput',
    description: 'Bid input',
    definition(t) {
        t.nonNull.string('txHash');
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
                if (auctionData.currentHigh >= args.offer) {
                    return newErr(`ClientErrorArgumentsConflict`, `Your bid is lower than the current high`)
                }

                let pending = false;

                const result = await chain.checkSuccessLog(
                    createBidEvent,
                    args.txHash
                );

                if (result === false) {
                    return newErr(`ExternalChainError`, `Transaction to the chain failed`)
                }
                if (result === null) { pending = true; }

                //TODO pass pending field once added
                const bid = await ctx.prisma.bid.create({ data: { auctionId: args.auctionId, offer: args.offer, userId: args.userId } })
                if (bid) {
                    if (pending) {
                        //TODO add pending feild on bids
                        //TODO add update event in chron.ts
                        return newErr(`ExternalChainErrorStillPending`, 'Could not get the transaction receipt and status, we will try again for the next 24hours.',)
                    }
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
                    return { "Bids": [bid] }
                } else {
                    return newErr(`ClientErrorUnknown`, `Error while creating the bid`)
                }
            }
        }
        )
    }
})