import { User } from '.prisma/client';
import jwt from 'jsonwebtoken';
import { prisma } from '../singletons/prisma';

export default async function forgeJWT(user: User) {
  const wallet = await prisma.wallet.findUnique({
    where: { id: user.walletId },
  });
  if (!wallet) throw new Error('No wallet found for test user');
  const token = jwt.sign(
    {
      user: {
        id: user.id,
        fullName: user.fullName,
        handle: user.handle,
        image: user.image,
        email: user.email,
        isApprovedCreator: user.isApprovedCreator,
        publicKey: wallet.publicKey,
      },
    },
    process.env.SERVER_SECRET ?? '',
    {
      expiresIn: '1d',
    }
  );
  return token;
}
