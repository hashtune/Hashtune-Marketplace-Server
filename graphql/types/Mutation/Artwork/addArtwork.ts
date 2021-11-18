import { extendType, inputObjectType } from 'nexus';
import { createTokenEvent } from '../../../../constants';
import chain from '../../../../singletons/chain';
import { Context } from '../../../context';

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
    t.nullable.field('salePrice', { type: 'BigInt' });
    t.nullable.field('reservePrice', { type: 'BigInt' });
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
        let pending = false;
        // TODO: Check that the creator creatorData.id is equal
        // to the session ID otherwise someone can
        // go around our UI, pass someone elses id and create
        // an artwork on their behalf
        if (creatorData?.isApprovedCreator) {
          // All need royalties defined
          // Option 1: 1 with a sale price,
          // Option 2: auction with a reserve price
          // Opiton 3: auction with no reserve price / reserve price of 0
          const isValidAuction = args.saleType == 'auction' && !args.salePrice;
          const isValidSale =
            args.saleType == 'fixed' && args.salePrice && !args.reservePrice;

          if (isValidAuction || isValidSale) {
            // TODO move this to a constants file that maps the name to the string
            const result = await chain.checkSuccessLog(
              createTokenEvent,
              args.txHash
            );
            // The transaction failed
            if (result === false) {
              return {
                ExternalChainError: {
                  message: `Transaction to the chain failed`,
                },
              };
            }
            // The transaction is pending
            if (result === null) {
              pending = true;
            }
            // Create the artwork ... pending if we could not get the txHash log
            let artwork;
            if (args.saleType === 'fixed') {
              const payload = {
                data: {
                  handle: args.handle,
                  title: args.title,
                  txHash: args.txHash,
                  image: args.image,
                  link: args.link,
                  pending,
                  media: args.media,
                  saleType: args.saleType,
                  price: args.salePrice || null,
                  description: args.description,
                  currentOwner: { connect: { id: args.currentOwner } },
                  creator: { connect: { id: args.creator } },
                },
              };
              artwork = await ctx.prisma.artwork.create(payload);
            } else {
              const payload = {
                data: {
                  handle: args.handle,
                  title: args.title,
                  txHash: args.txHash,
                  image: args.image,
                  link: args.link,
                  pending,
                  media: args.media,
                  saleType: args.saleType,
                  reservePrice: args.reservePrice || null,
                  description: args.description,
                  currentOwner: { connect: { id: args.currentOwner } },
                  creator: { connect: { id: args.creator } },
                  auctions: {
                    createMany: {
                      data: [{}],
                    },
                  },
                },
              };
              artwork = await ctx.prisma.artwork.create(payload);
            }

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
                path: `${args.saleType == 'auction' && args.salePrice
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
