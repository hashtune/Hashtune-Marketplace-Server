import { extendType, inputObjectType } from 'nexus';
import { Context } from '../../context';

const InputType = inputObjectType({
    name: 'CreateArtworkInput',
    description: 'Artwork input',
    definition(t) {
        t.nonNull.string('handle');
        t.nonNull.string('title');
        t.nonNull.string('image');
        t.nonNull.string('description');
        t.nonNull.string('link');
        t.nonNull.field('media', { type: 'Json' });
        t.nonNull.string('saleType');
        t.field('price', { type: 'BigInt' });
        t.field('reservePrice', { type: 'BigInt' });
        t.nonNull.string('currentOwner');
        t.nonNull.string('creator');
    }
})

export const artworkMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('addArtwork', {
            type: 'Artwork',
            description: 'Add an artwork to the database',
            args: { InputType },
            resolve: async (_, args, ctx: Context) => {
                args = args.InputType;
                if (args.saleType == 'auction' && !args.price) {
                    return ctx.prisma.artwork.create({
                        data: {
                            handle: args.handle,
                            title: args.title,
                            image: args.image,
                            link: args.link,
                            media: args.media,
                            saleType: args.saleType,
                            price: args.price,
                            reservePrice: args.reservePrice,
                            description: args.description,
                            currentOwner: { connect: { id: args.currentOwner } },
                            creator: { connect: { id: args.creator } }
                        }
                    })
                } else if (args.saleType == 'fixed' && args.price) {
                    // TODO Implement creation of fixed price artword
                    return {
                        "message": "Not implemented yet"
                    }
                } else {
                    // TODO Throw error
                    return {
                        "message": "Mismatched args"
                    }
                }
            },
        })
    }
})