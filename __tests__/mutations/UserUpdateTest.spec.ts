import chain from '../../singletons/chain';
import getGlobalData from '../../utils/getGlobalData';
import reset from '../../utils/reset';
import seed from '../../utils/seed';
import server from '../server';

describe('Test user update mutation', () => {
  chain.checkSuccessLog = jest.fn();

  let users;

  beforeAll(async () => {
    await reset();
    await seed();
    global.testData = await getGlobalData();
    users = await global.testData.users;
  });

  const UPDATE_ARTWORK_MUTATION = `
  mutation UpdateUser($inputType: UpdateUserInput) {
    updateUser(InputType: $inputType) {
      Users {
        fullName
        handle
        email
        bio
        image
      }
      ClientErrorUserNotFound {
        message
      }
      ClientErrorUnknown {
        message
      }
      ClientErrorInvalidHandle {
        message
      }
      ClientErrorHandleAlreadyExists {
        message
      }
    }
  }
    `;

  const updateUser = async (
    userId: string,
    fullName: undefined | string = undefined,
    handle: undefined | string = undefined,
    email: undefined | string = undefined,
    bio: undefined | string = undefined,
    image: undefined | string = undefined
  ) => {
    return await server.executeOperation({
      query: UPDATE_ARTWORK_MUTATION,
      variables: {
        inputType: {
          userId,
          fullName,
          handle,
          email,
          bio,
          image,
        },
      },
    });
  };

  it('Should update the user', async () => {
    const res = await updateUser(
      users[0].id,
      'Humam Abo Alraja',
      'humam',
      'humam@hashtune.co',
      'A placeholder to test with',
      'IMAGE_URL'
    );
    expect(res).toMatchSnapshot();
  });
});
