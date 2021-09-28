import { extendType, nonNull, stringArg } from 'nexus';
import { Context } from '../../context';

export const deleteArtwork = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('deleteArtwork', {
            type: 'Artwork',
            description: 'Delete an artwork from the database. Accepts one id argument.',
            args: {
                id: nonNull(stringArg())
            },
            resolve: async (_, args, ctx: Context) => {
                const artwork = await ctx.prisma.artwork.findUnique({ where: { id: args.id } })
                if (artwork) {
                    return await ctx.prisma.artwork.delete({ where: { id: args.id } })
                } else {
                    throw new Error(`Couldn't find an artwork with id ${args.id}`)
                }

            }
        })
    }
});