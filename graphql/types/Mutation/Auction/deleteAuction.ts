import { extendType, nonNull, stringArg } from 'nexus';
import { Context } from '../../../context';

export const deleteAuction = extendType({
    type: "Mutation",
    definition(t) {
        t.field("deleteAuction", {
            type: "AuctionResult",
            description: "delete an Auction if it has no bids",
            args: {
                userId: nonNull(stringArg()),
                auctionId: nonNull(stringArg())
            },
            resolve: async (_, args, ctx: Context) => {
                const auctionData = await ctx.prisma.auction.findUnique({ where: { id: args.auctionId } });
                if (!auctionData) return { ClientErrorAuctionNotFound: { message: "Couldn't find an auction with the specified id" } }

                const bidsData = await ctx.prisma.bid.findMany({ where: { auctionId: auctionData.id } });
                if (bidsData && bidsData.length > 0) return { ClientErrorAuctionNotDeletable: { message: "Cannot delete an auction with bids" } }

                const artworkData = await ctx.prisma.artwork.findUnique({ where: { id: auctionData.artworkId } })
                if (!artworkData) return { ClientErrorArtworkNotFound: { message: `Couldn't find an artwork with id ${args.artworkId}` } }
                if (artworkData.ownerId !== args.userId) return { ClientErrorUserUnauthorized: { message: `The user is not the owner of the artwork` } }

                const res = await ctx.prisma.auction.delete({ where: { id: args.auctionId } })
                return res ? ({ "Auctions": [res] }) : ({ ClientErrorUnknown: { message: "Error while deleting the auction" } })
            }
        })
    }

})