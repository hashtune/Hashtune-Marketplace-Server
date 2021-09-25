import reset from '../utils/reset';
import seed from '../utils/seed';
import server from './server';

export default async function setup(): Promise<void> {
  try {
    await reset();
    await seed();
    await server.start();
  } catch (e) {
    throw new Error('Issue setting up test');
  }
}
