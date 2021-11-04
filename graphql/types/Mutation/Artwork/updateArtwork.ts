import { extendType, inputObjectType } from 'nexus';
import { createEvent } from '../../../../constants';
import chain from '../../../../singletons/chain';
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

export const updateArtwork = extendType({
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

                let pending = false;
                const result = await chain.checkSuccessLog(
                    createEvent,
                    args.txHash
                );
                if (result === false) return { ExternalChainError: { message: `Transaction to the chain failed` } };
                if (result === null) pending = true;


                const artwork = await ctx.prisma.artwork.update({
                    where: {
                        id: args.artworkId
                    },
                    data: {
                        [fieldToUpdate]: newValue
                    }
                })

                if (artwork) {
                    if (result === null) return {
                        ExternalChainErrorStillPending: {
                            message:
                                'Could not get the transaction receipt and status, we will try again for the next 24hours.',
                        },
                    };
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
