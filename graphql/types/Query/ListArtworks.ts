import { booleanArg, extendType } from 'nexus';
import { Context } from '../../context';

export const ListArtworks = extendType({
    type: 'Query',
    definition(t) {
        t.list.field('listArtworks', {
            type: 'Artwork',
            description:
                'If only auction argument is true then all auctions are returned. If not then all artworks are returned. ',
            args: {
                auction: booleanArg(),
            },
            resolve: async (_, args, ctx: Context) => {
                if (args.auction) {
                    return ctx.prisma.artwork.findMany({
                        where: {
                            saleType: 'auction',
                        },
                    });
                }
                // Both sale and non sale
                return ctx.prisma.artwork.findMany({});
            },
        });

    },
});
