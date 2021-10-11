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
     fullName
     email
     handle
     image
     bio
     isApprovedCreator
     wallet {
       id
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
    walletId: 'ckuk9a7uu0000a2hf1rxoiasp',
  };

  it('should create a user', async () => {
    const res = await server.executeOperation({
      query: CREATE_USER_MUTATION,
      variables: {
        addArtworkInputType: {
          ...exampleArgs,
        },
      },
    });
    expect(res).toMatchSnapshot();
  });
});

export {};
