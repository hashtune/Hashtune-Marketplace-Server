// This file should run before every individual spec file
import server from './server';

export default async function setup(): Promise<void> {
  await server.start();
}
