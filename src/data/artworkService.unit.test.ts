// import { Artwork } from '@prisma/client';
// import prismaMock from '@src/__tests__/__mocks__/prismaMock';
// import { createArtwork } from '@src/data/artworkService';

// describe('artwork service tests', () => {
//   describe('create artwork test', () => {
//     test('it should create artwork with passed in args', async () => {
//       const mockArtwork: Artwork = {
//         id: 1,
//         title: 'Hey moon',
//         user: 'john maus',
//       };

//       prismaMock.artwork.create.mockResolvedValue(mockArtwork);

//       const artworkCreated = await createArtwork(mockArtwork.title, mockArtwork.user);

//       expect(artworkCreated).toBe(mockArtwork);
//       expect(prismaMock.artwork.create).toHaveBeenCalledTimes(1);
//       expect(prismaMock.artwork.create).toHaveBeenCalledWith({
//         data: { title: mockArtwork.title, user: mockArtwork.user },
//       });
//     });
//   });
// });
