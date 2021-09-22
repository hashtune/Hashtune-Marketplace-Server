// This file should run after every individual spec file
import server from './server';

export default async function teardown() {
  try {
    server.stop();
    process.exit(0);
  } catch (e) {
    console.log('error tearing down tests', e);
    process.exit(1);
  }
}
