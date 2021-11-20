![](.github/assets/images/cover.png)

<div align="center">

# **Hashtune Marketplace Server**
</div>
  
## Architecture 🏛

The architecutre consists of 3 repositories:

1. [Client](https://github.com/hashtune/Hashtune-Marketplace-Client)
2. [Server](https://github.com/hashtune/Hashtune-Marketplace-Server)
3. [Smart Contracts (currently on the Binance Test Network)](https://github.com/hashtune/Hashtune-Marketplace-Chain)

![](.github/assets/images/architecture.png)

Each repository has its own steps for set up, development, and testing. This document only covers the server.

---

## Setup 🏗

You need to crate the following files in the root directory:

- `.env.local`, containing a DATABASE_URL variable corresponding to the postgres DB from the docker-compose file, and STAGE="development";

- `.env.test`, containing a DATABASE_URL variable corresponding to the postgres DB from the docker-compose file, and STAGE="test".

Run `yarn` to install the dependencies;

---

## Development 🚀

Run the following commands to start a development server:

1. `yarn docker:up` To start the database locally;

2. `yarn prisma:migrate` To migrate the database;

3. `yarn prisma:generate` To generate the client;

4. `yarn nexus:watch` In another terminal tab, to generate a GraphQL TYPE file in `node_modules/@types/nexus-typegen/index.d.ts` and a GraphQL schema file called `schema.graphql`. Do NOT edit these files;

5. `yarn dev` In another terminal tab, to start the server on port 5000. Optionally override the port in .env;

6. `yarn cron` In another terminal tab, to start the hourly cron that will be run in production to sync the chain and the server;

7. `yarn data:seed` To create some seed data (same data used in API tests).

You can now visit `http://localhost:5000/graphql` for the playground.

//TODO change the server file to make sure that the playground is available locally and remove duplicated cors policies

---

## Testing 🧪

#### Locally on the Hardhat Network

Different options are available for testing the server, you can run:

- `yarn test:watch` To run API integration tests in watch mode while writing them;

- `yarn test:api` To run API integration tests;

- `yarn test:api -u` To update API integration test snapshots;
