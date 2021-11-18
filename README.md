# Hashtune-Marketplace-Server

## Development

Make sure you have `.env.local` with a DATABASE_URL corresponding to the postgres DB from the docker-compose file, and STAGE="development", and ENVIRONMENT="development".

Also add a `.env.test` file with a DATABASE_URL corresponding to the postgres DB from the docker-compose file, and STAGE="test", and ENVIRONMENT="development".

`yarn` Install dependencies

`docker-compose up -d` Start database

`yarn prisma:migrate` Migrate the database

`yarn prisma:generate` Generate the client

`yarn nexus:watch` It will generate a GraphQL TYPE file node_modules/@types/nexus-typegen/index.d.ts and a GraphQL schema file called schema.graphql. Do NOT edit these.

`yarn dev` to start the server on port 5000. Optionally override the port in .env

`yarn cron` to start the hourly cron that will be run in prod to sync chain and artworks in another terminal

`http://localhost:5000/graphql` for the playground

`yarn data:seed` to create some seed data (same data used in API tests)

`yarn data:reset` to delete all the seed data createed in the database

## Testing

`yarn test:watch` to run API integration tests in watch mode while writing them

`yarn test:api` to run API integration tests

`yarn test:api -u` to update API integration test snapshots
