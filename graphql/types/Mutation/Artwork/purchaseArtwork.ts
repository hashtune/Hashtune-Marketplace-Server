import { extendType, inputObjectType } from 'nexus';
import { fixedSalePurchaseEvent } from '../../../../constants';
import { Context } from '../../../../graphql/context';
import chain from '../../../../singletons/chain';

// TODO API tests for purchase artwork
const InputType = inputObjectType({
  name: 'CreateFixedSaleInput',
  description: 'Purchase fixed sale NFT input',
  definition(t) {
    t.nonNull.string('txHash');
    t.nonNull.string('artworkId');
    t.nonNull.field('price', {
      type: 'BigInt',
    });
  },
});
export const puchaseFixedSaleArtwork = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('puchaseFixedSaleArtwork', {
      type: 'ArtworkResult',
      description: 'Purchase a fixed sale artwork',
      args: { InputType },
      resolve: async (_, args, ctx: Context) => {
        args = args.InputType;
        const { txHash, artworkId, price } = args;
        const userId = ctx?.user?.id;
        // TODO make sure the user exists in the database first of

        if (!userId)
          return {
            ClientErrorUserUnauthorized: {
              message: 'Not approved or non-existing creator',
            },
          };

        const result = await chain.checkSuccessLog(
          fixedSalePurchaseEvent,
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
        if (result === null) {
          return {
            ExternalChainErrorStillPending: {
              message:
                'Could not get the transaction receipt and status, we will try again for the next 24hours.',
            },
          };
        }

        let artwork;
        await ctx.prisma.$transaction(async prisma => {
          artwork = await prisma.artwork.update({
            where: {
              id: artworkId,
            },
            data: {
              currentOwner: {
                connect: {
                  id: userId,
                },
              },
              listed: false,
            },
          });
          await prisma.sale.create({
            data: {
              artworkId: artworkId,
              price: price,
              userId: userId,
            },
          });
          await prisma.event.create({
            data: {
              artwork: artwork.id,
              user: ctx.user.id,
              eventData: {
                create: {
                  price: price,
                  eventType: 'buyer_sale_created',
                  txHash: txHash,
                },
              },
            },
          });
        });

        if (artwork) {
          return { Artworks: [artwork] };
        } else {
          // May have worked on the chain and not in our database... Contact support in this case
          return {
            ExternalChainError: {
              message: `Issue creating the artwork in the database ${artwork}`,
            },
          };
        }
      },
    });
  },
});
