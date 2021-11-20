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

- `.env.local`, containing a `DATABASE_URL` variable corresponding to the postgres DB from the docker-compose file, and `STAGE="development"`;

- `.env.test`, containing a `DATABASE_URL` variable corresponding to the postgres DB from the docker-compose file, and `STAGE="test"`.

Run `yarn` to install the dependencies;

---

## Development 🚀

Run the following commands to start a development server:

1. `yarn docker:up` To start the database locally;

2. `yarn prisma:migrate` To migrate the database;

3. `yarn prisma:generate` To generate the client;

4. `yarn nexus:watch` In another terminal tab, to generate a GraphQL type file in `node_modules/@types/nexus-typegen/index.d.ts` and a GraphQL schema file called `schema.graphql`. Do NOT edit these files;

5. `yarn dev` In another terminal tab, to start the server on port 5000. Optionally override the port in .env;

6. `yarn cron` In another terminal tab, to start the hourly cron that will be run in production to sync the chain and the server;

7. `yarn data:seed` To create some seed data (same data used in API tests).

You can now visit `http://localhost:5000/graphql` for the playground.

---

## Testing 🧪


Different options are available for testing the server, you can run:

- `yarn test:watch` To run API integration tests in watch mode while writing them;

- `yarn test:api` To run API integration tests;

- `yarn test:api -u` To update API integration test snapshots.

---

## Security 🕵️‍♂️

Security is a top-level priority for us. To know more about all the security measures we implemented in our server, see our [SECURITY.md file](https://github.com/hashtune/Hashtune-Marketplace-Server/blob/main/README/SECURITY.md).

---

## Types, Queries, and Mutations 🗂

Data Types, Queries, and Mutations are defined in the `./graphql/types/` folder. Since we used a code-first approach, everything is defined with the nexus  library using `objectType` and `extendType`.

### Types

We can differentiate between 3 kinds of types: Data Types, Error Types, and Return Types.

#### Data Types

Data Types represent the models defined in the `schema.prisma` file.

| Name | Description |
|------|-------------|
| Artwork | Returns the data relevant to the artwork |

#### Error Types

Error Types are currently used to give the client more information about what went wrong in a request in case of error. We could remove these types for security reasons once we launch our product.

#### Return Types

Return Types are used to wrap and return Data Types and Error Types.

### Queries

### Mutations

---

## Database Entity-Relationship Model 📌
