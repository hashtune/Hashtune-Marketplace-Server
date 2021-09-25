import { arg, extendType, nonNull, stringArg } from 'nexus';
import { Context } from '../../context';

export const artworkMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('addArtwork', {
            type: 'Artwork',
            description: 'Add an artwork to the database',
            args: {
                handle: nonNull(stringArg()),
                title: nonNull(stringArg()),
                image: nonNull(stringArg()),
                description: nonNull(stringArg()),
                link: nonNull(stringArg()),
                media: nonNull(arg({ type: 'Json' })),
                saleType: nonNull(stringArg()),
                price: arg({ type: 'BigInt' }),
                reservePrice: arg({ type: 'BigInt' }),
                currentOwner: nonNull(stringArg()),
                creator: nonNull(stringArg())
            },
            resolve: async (_, args, ctx: Context) => {
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
                    console.log("fixed")
                } else {
                    // TODO Throw erro
                    console.log("err")
                }
            },
        })
    }
})