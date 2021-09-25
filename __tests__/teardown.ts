import reset from '../utils/reset';
import server from './server';

export default async function teardown(): Promise<void> {
  try {
    await reset();
    server.stop();
  } catch (e) {
    throw new Error('Issue tearing down test');
  }
}
