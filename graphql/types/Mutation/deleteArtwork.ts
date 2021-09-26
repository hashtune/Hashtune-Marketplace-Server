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
                return await ctx.prisma.artwork.delete({ where: { id: args.id } })
            }
        })
    }
});