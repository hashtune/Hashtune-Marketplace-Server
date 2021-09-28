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
                if (args.auction === true) {
                    return ctx.prisma.artwork.findMany({
                        where: {
                            saleType: 'auction',
                        },
                    });
                } else if (args.auction === false) {
                    return ctx.prisma.artwork.findMany({
                        where: {
                            saleType: 'fixed',
                        },
                    });
                } else {
                    return ctx.prisma.artwork.findMany({ orderBy: { saleType: "asc" } });
                }
            },
        });

    },
});
