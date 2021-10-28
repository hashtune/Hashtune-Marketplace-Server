import { extendType, inputObjectType } from 'nexus';
import { createEvent } from '../../../constants';
import chain from '../../../singletons/chain';
import { Context } from '../../context';
const InputType = inputObjectType({
  name: 'CreateArtworkInput',
  description: 'Artwork input',
  definition(t) {
    t.nonNull.string('txHash');
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
              txHash: args.txHash,
              image: args.image,
              link: args.link,
              pending: false,
              media: args.media,
              saleType: args.saleType,
              price: args.price,
              reservePrice: args.reservePrice || null,
              description: args.description,
              currentOwner: { connect: { id: args.currentOwner } },
              creator: { connect: { id: args.creator } },
            },
          };
          console.log({ payload });
          const isValidAuction = args.saleType == 'auction' && !args.price;
          const isValidSale =
            args.saleType == 'fixed' && args.price && !args.reservePrice;
          if (isValidAuction || isValidSale) {
            // TODO move this to a constants file that maps the name to the string
            const result = await chain.checkSuccessLog(
              createEvent,
              args.txHash
            );
            console.log({ result });
            // The transaction failed
            if (result === false) {
              return {
                ExternalChainError: {
                  message: `Transaction to the chain failed`,
                },
              };
            }
            console.log('pending');
            // The transaction is pending
            if (result === null) {
              payload.data.pending = true;
            }
            console.log('creating artwork in db');
            // Create the artwork ... pending if we could not get the txHash log
            const artwork = await ctx.prisma.artwork.create(payload);
            if (artwork) {
              if (result === null) {
                return {
                  ExternalChainErrorStillPending: {
                    message:
                      'Could not get the transaction receipt and status, we will try again for the next 24hours.',
                  },
                };
              }
              return { Artworks: [artwork] };
            } else {
              // May have worked on the chain and not in our database... Contact support in this case
              return {
                ExternalChainError: {
                  message: `Issue creating the artwork in the database ${artwork}`,
                },
              };
            }
          } else {
            return {
              // May have worked on the chain and not in our database... Contact support in this case
              ClientErrorArgumentsConflict: {
                message: `Argument conflict.`,
                path: `${
                  args.saleType == 'auction' && args.price
                    ? "Auction doesn't need a price arg"
                    : 'Fixed sale requires a price arg and no reservePrice arg'
                }`,
              },
            };
          }
        } else {
          return {
            // May have worked on the chain and not in our database... Contact support in this case
            ClientErrorUserUnauthorized: {
              message: 'Not approved or non-existing creator',
            },
          };
        }
      },
    });
  },
});
