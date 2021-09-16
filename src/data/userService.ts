import { User, prisma } from '@prisma/client';
import prismaContext from '@src/lib/prisma/prismaContext';

export const getAllUsers = async (): Promise<User[]> => {
  const users = await prismaContext.prisma.user.findMany();
  return users;
};

export const getUserById = async (id: string): Promise<User | null> => {
  return prismaContext.prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const createUser = async (id: string): Promise<User> => {
  const user = await prismaContext.prisma.user.create({
    data: { id },
  });
  return user;
};
