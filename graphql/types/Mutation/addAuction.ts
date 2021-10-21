import { extendType, inputObjectType } from 'nexus';
import { Context } from '../../context';

const InputType = inputObjectType({
    name: 'AddAuctionInput',
    description: 'Auction input',
    definition(t) {
        t.nonNull.string("userId")
        t.nonNull.string("artworkId");
        t.nonNull.boolean("live");
        t.string("liveAt");
    },
});

export const addAuction = extendType({
    type: "Mutation",
    definition(t) {
        t.field("addAuction", {
            type: "AuctionResult",
            description: "Create an auction for a given artwork",
            args: { InputType },
            resolve: async (_, args, ctx: Context) => {
                args = args.InputType
                //TODO: add tests
                const artworkData = await ctx.prisma.artwork.findUnique({
                    where: { id: args.artworkId },
                });

                const auctionData = await ctx.prisma.auction.findFirst({
                    where: { artworkId: args.artworkId },
                });

                if (auctionData) return { ClientErrorArtworkAlreadyExists: { message: `An auction for the specified artwork already exists` } }
                if (!artworkData) return { ClientErrorArtworkNotFound: { message: `Couldn't find an artwork with id ${args.artworkId}` } }
                //todo: decide if we want to allow users to change the type of an artwork
                if (artworkData.saleType !== 'auction') return { ClientErrorArtworkNotAnAuction: { message: `The specified artwork is not of auction type` } }
                if (artworkData.ownerId !== args.userId) return { ClientErrorUserUnauthorized: { message: `The user is not the owner of the artwork` } }

                const now = new Date();
                const payload = {
                    data: {
                        artworkId: args.artworkId,
                        bids: {
                            create: []
                        },
                        currentHigh: 0,
                        live: args.live,
                        liveAt: args.liveAt,
                        createdAt: now,
                        updatedAt: now,
                        isFinalized: false
                    }
                }
                const res = ctx.prisma.auction.create(payload);
                return res ? ({ "Auctions": [res] }) : ({ ClientErrorUnknown: { message: "Error while creating the user" } })

            }
        })
    }
})