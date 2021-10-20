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
                //TODO: check if the user owns the artwork
                //TODO: return proper errors
                //TODO: add tests
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
                const res = ctx.prisma.auction.create(payload)
                return { "Auction": res }
            }
        })
    }
})