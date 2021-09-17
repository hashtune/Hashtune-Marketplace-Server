import { objectType } from 'nexus';
//import { User } from 'nexus-prisma';
// import { ClientError } from '../../typeSources';

export const UserType = objectType({
  name: 'User',
  definition(t) {
    t.string('id');
    t.string('test');
    t.string('hiii');
    // t.field(User.id);
    // t.field(User.handle);
    // t.field(User.displayName);
    // t.field(User.image);
  },
});
