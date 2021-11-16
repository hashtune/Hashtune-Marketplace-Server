import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({});

prisma.$use(async (params, next) => {
  if (params.model === 'Artwork') {
    if (params.action == 'findUnique') {
      // Change to findFirst - you cannot filter
      // by anything except ID / unique with findUnique
      params.action = 'findFirst';
      // Add 'pending' filter
      // ID filter maintained
      params.args.where['pending'] = false;
    }
    if (params.action === 'findMany') {
      if (params.args.where != undefined) {
        if (params.args.where.pending == undefined) {
          params.args.where['pending'] = false;
        }
      } else {
        params.args['where'] = { pending: false };
      }
    }
  }
  return next(params);
});
