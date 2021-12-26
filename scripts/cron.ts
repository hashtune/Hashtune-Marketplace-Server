const cron = require('node-cron');

// We should make a back up before running the cron
// TODO: fetch every artwork from ipfs and create resource if necessary
cron.schedule('*/59 * * * *', async () => {
  console.log('RUNNING ARTWORK CRON');
  // const pendingArtworks = await prisma.artwork.findMany({
  //   where: {
  //     pending: true,
  //   },
  //   include: {
  //     auctions: true,
  //   },
  // });

  // Delete artworks that are > 24hours old
  // console.log('DELETING OLD ARTWORKS');
  // pendingArtworks.forEach(async art => {
  //   const oneDay = 24 * 60 * 60 * 1000;
  //   const yesterday = new Date().getTime();
  //   const createdAt = new Date(art.createdAt).getTime();
  //   if (yesterday - createdAt > oneDay) {
  //     // If there's an auction attached we need to delete that first
  //     if (art.auctions && art.auctions.length > 0) {
  //       await prisma.auction.delete({
  //         where: {
  //           id: art.auctions[0].id,
  //         },
  //       });
  //     }
  //     await prisma.artwork.delete({
  //       where: {
  //         id: art.id,
  //       },
  //     });
  //   }
  // });

  // // Query the updated artworks
  // const updatedPendingArtworks = await prisma.artwork.findMany({
  //   where: {
  //     pending: true,
  //   },
  // });

  // // Check chain for event again
  // console.log('CHECKING CHAIN FOR PENDING WORKS');
  // updatedPendingArtworks.forEach(async art => {
  //   const tx = await chain.checkSuccessLog(createEvent, art.txHash);
  //   if (tx !== null && tx !== false) {
  //     await prisma.artwork.update({
  //       where: {
  //         id: art.id,
  //       },
  //       data: {
  //         pending: false,
  //       },
  //     });
  //   }
  // });
});
