import { enumType, objectType } from 'nexus';
import { EventType } from 'nexus-prisma';
import { Context } from '../../context';

export const eventTypeEnum = enumType(EventType);

export const Event = objectType({
  name: 'Event',
  definition(t) {
    t.string('id');
    t.field('version', {
      type: 'BigInt',
    });
    t.field('createdAt', {
      type: 'DateTime',
    });
    t.string('user');
    t.field('userEventId', {
      type: 'User',
      resolve: async (event, _, ctx: Context) => {
        const res = await ctx.prisma.user.findUnique({
          where: {
            id: event.user,
          },
        });
        return res;
      },
    });
    t.field('eventData', {
      type: EventData,
      resolve: async (event, _, ctx: Context) => {
        const res = await ctx.prisma.event.findUnique({
          where: {
            id: event.id,
          },
          include: {
            eventData: true,
          },
        });
        return res;
      },
    });
  },
});

export const EventData = objectType({
  name: 'EventData',
  definition(t) {
    t.string('id');
    t.string('txHash', {
      resolve: event => {
        return event.eventData.txHash;
      },
    });
    t.nullable.field('eventType', {
      type: eventTypeEnum,
      resolve: event => {
        return event.eventData.eventType;
      },
    });
    t.nullable.field('price', {
      type: 'BigInt',
      resolve: event => {
        return event.eventData.price ?? null;
      },
    });
  },
});
