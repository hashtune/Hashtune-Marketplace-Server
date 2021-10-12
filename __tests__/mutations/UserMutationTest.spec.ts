import reset from '../../utils/reset';
import seed from '../../utils/seed';
import server from '../server';
import cryptoRandomString from 'crypto-random-string';

describe('Test user mutations', () => {
  beforeAll(async () => {
    await reset();
    await seed();
  });
  const CREATE_USER_MUTATION = `
  mutation registerUser($inputType: RegisterUserInput) {
   registerUser(InputType: $inputType) {
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
});

export {};
