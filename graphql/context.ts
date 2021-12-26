import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { prisma } from '../singletons/prisma';

export type Context = {
  req: any;
  res: any;
  user: any | null;
  prisma: PrismaClient;
};
// Req will be of type Next request
export async function createContext(req, res): Promise<Context> {
  return {
    res: res,
    req: req,
    user: extractUserFromToken(req?.req?.cookies?.jwt, req?.req?.headers?.jwt),
    prisma,
  };
}

export const extractUserFromToken = (
  rawCookieToken: string | undefined,
  rawHeaderToken: string | undefined
): any | null => {
  if (!rawHeaderToken && !rawCookieToken) return null;
  return jwt.verify(
    rawCookieToken ?? rawHeaderToken,
    process.env.SERVER_SECRET ?? '',
    (err: any, data: any) => {
      if (!err && data.user.id) {
        return data.user;
      } else {
        return null;
      }
    }
  );
};
