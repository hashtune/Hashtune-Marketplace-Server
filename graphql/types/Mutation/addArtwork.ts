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
  },
});

export const addArtwork = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('addArtwork', {
      type: 'ArtworkResult',
      description: 'Add an artwork to the database',
      args: { InputType },
      resolve: async (_, args, ctx: Context) => {
        args = args.InputType;
        const creatorData = await ctx.prisma.user.findUnique({
          where: { id: args.creator },
        });
        // TODO: Check that the creator creatorData.id is equal
        // to the session ID otherwise someone can
        // go around our UI, pass someone elses id and create
        // an artwork on their behalf
        if (creatorData?.isApprovedCreator) {
          const payload = {
            data: {
              handle: args.handle,
              title: args.title,
              image: args.image,
              link: args.link,
              media: args.media,
              saleType: args.saleType,
              price: args.price,
              reservePrice: args.reservePrice || null,
              description: args.description,
              currentOwner: { connect: { id: args.currentOwner } },
              creator: { connect: { id: args.creator } },
            },
          };
          const isValidAuction = args.saleType == 'auction' && !args.price;
          const isValidSale =
            args.saleType == 'fixed' && args.price && !args.reservePrice;
          if (isValidAuction || isValidSale) {
            return { Artworks: [ctx.prisma.artwork.create(payload)] };
          } else {
            return {
              ArtworkArgumentsConflict: {
                message: `Argument conflict.`,
                path: `${args.saleType == 'auction' && args.price
                  ? "Auction doesn't need a price arg"
                  : 'Fixed sale requires a price arg and no reservePrice arg'}`,
              }
            }
          }
        } else {
          return { UserUnauthorized: { message: 'Not approved or non-existing creator' } };
        }
      },
    });
  },
});
