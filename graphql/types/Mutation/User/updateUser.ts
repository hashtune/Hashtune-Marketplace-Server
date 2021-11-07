import { extendType, inputObjectType } from 'nexus';
import { Context } from '../../../context';

const InputType = inputObjectType({
  name: 'UpdateUserInput',
  description: 'User input',
  definition(t) {
    t.nonNull.string('userId');
    t.string('fullName');
    t.string('handle');
    t.string('email');
    t.string('bio');
    t.string('image');
  },
});
