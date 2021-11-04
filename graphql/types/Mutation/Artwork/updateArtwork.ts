import { extendType, inputObjectType } from 'nexus';
import { Context } from '../../../context';

const InputType = inputObjectType({
    name: 'UpdateArtworkInput',
    description: 'Artwork input',
    definition(t) {
        t.nonNull.string('txHash');
        t.nonNull.string('artworkId');
        t.nonNull.string('userId');
        t.nullable.field('salePrice', { type: 'BigInt' });
        t.nullable.field('reservePrice', { type: 'BigInt' });
    },
});

export const updateArtworkPrices = extendType({
    type: "Mutation",
    definition(t) {
        t.field('updateArtwork', {
            type: "ArtworkResult",
            description: "edit the price or reserve price of an artwork",
            args: { InputType },
            resolve: async (_, args, ctx: Context) => {
                args = args.InputType;

                const artworkData = await ctx.prisma.artwork.findUnique({ where: { id: args.artworkId } })
                if (!artworkData) return { ClientErrorArtworkNotFound: { message: "Couldn't find the artwork" } }

                if (artworkData.saleType === 'fixed' && args.salePrice == undefined) return {
                    ClientErrorArgumentsConflict: {
                        message: "Argument Conflict",
                        path: "'price' is required for artworks of type 'fixed'"
                    }
                }
                //if the user deosn't specify a new price for auction, remove the reserve price
                if (artworkData.saleType === 'auction' && args.reservePrice == undefined) args.reservePrice = null;

                if (artworkData.ownerId !== args.userId) return { ClientErrorUserUnauthorized: { message: `The user is not the owner of the artwork` } }

                const fieldToUpdate = artworkData.saleType === 'auction' ? "reservePrice" : "price";
                const newValue = artworkData.saleType === 'auction' ? args.reservePrice : args.salePrice;

                const artwork = await ctx.prisma.artwork.update({
                    where: {
                        id: args.artworkId
                    },
                    data: {
                        [fieldToUpdate]: newValue
                    }
                })

                if (artwork) {
                    return { Artworks: [artwork] };
                } else {
                    return {
                        ClientErrorUnknown: {
                            message: 'Something went wrong while creating the artwork. Please contact our technical support'
                        },
                    };
                }

            }
        })
    }
})
