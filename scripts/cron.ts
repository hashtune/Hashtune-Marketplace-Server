import { createEvent } from '~/constants';
import chain from '~/singletons/chain';
import { prisma } from '~/singletons/prisma';
const cron = require('node-cron');

cron.schedule('*/59 * * * *', async () => {
  const pendingArtworks = await prisma.artwork.findMany({
    where: {
      pending: true,
    },
  });

  // Delete artworks that are > 24hours old
  pendingArtworks.forEach(async art => {
    const oneDay = 24 * 60 * 60 * 1000;
    const yesterday = new Date().getTime();
    const createdAt = new Date(art.createdAt).getTime();
    if (yesterday - createdAt > oneDay) {
      await prisma.artwork.delete({
        where: {
          id: art.id,
        },
      });
    }

    // Check chain for event again
    const tx = await chain.checkSuccessLog(createEvent, art.txHash);
    if (tx !== null && tx !== false) {
      await prisma.artwork.update({
        where: {
          id: art.id,
        },
        data: {
          pending: false,
        },
      });
    }
  });
});
