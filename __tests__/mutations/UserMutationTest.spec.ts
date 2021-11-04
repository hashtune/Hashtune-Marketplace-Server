import reset from '../../utils/reset';
import seed from '../../utils/seed';
import server from '../server';

describe('Test user mutations', () => {
  beforeAll(async () => {
    await reset();
    await seed();
  });
  const CREATE_USER_MUTATION = `
  mutation registerUser($inputType: RegisterUserInput) {
   registerUser(InputType: $inputType) {
     Users {
      fullName
      email
      handle
      image
      bio
      isApprovedCreator
      wallet {
        publicKey
      }
     }
     ClientErrorUserNotFound {
      message
     }
     ClientErrorUnknown {
      message
     }
     ClientErrorHandleAlreadyExists {
       message
     }
     ClientErrorInvalidHandle {
       message
     }
   }
 }
    `;

  const exampleArgs = {
    fullName: 'Humam Abo Alraja',
    email: 'test@hashtune.co',
    handle: 'humam',
    image: '734q6utyfouivygioq.jpg',
    bio: 'All things Crypto, reflection level 1009%',
    isApprovedCreator: false,
    wallet: 'ckuo1gjak0007wfhfqxk23q73',
  };

  it('should create a user', async () => {
    const res = await server.executeOperation({
      query: CREATE_USER_MUTATION,
      variables: {
        inputType: {
          ...exampleArgs,
        },
      },
    });
    expect(res).toMatchSnapshot();
  });
  it('should not create a user if the handle is capitalized', async () => {
    const res = await server.executeOperation({
      query: CREATE_USER_MUTATION,
      variables: {
        inputType: {
          ...exampleArgs,
          handle: 'HUMAM',
        },
      },
    });
    expect(res).toMatchSnapshot();
  });
  it('should not create a user if the handle contains non alphanumric characters', async () => {
    const res = await server.executeOperation({
      query: CREATE_USER_MUTATION,
      variables: {
        inputType: {
          ...exampleArgs,
          handle: '*****',
        },
      },
    });
    expect(res).toMatchSnapshot();
  });
  it('should not create a user if the handle contains over 30 characters', async () => {
    const res = await server.executeOperation({
      query: CREATE_USER_MUTATION,
      variables: {
        inputType: {
          ...exampleArgs,
          handle: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        },
      },
    });
    expect(res).toMatchSnapshot();
  });
  it('should not create a user if the handle is already taken', async () => {
    const res = await server.executeOperation({
      query: CREATE_USER_MUTATION,
      variables: {
        inputType: {
          ...exampleArgs,
          handle: 'humam',
        },
      },
    });
    expect(res).toMatchSnapshot();
  });
});

export {};
