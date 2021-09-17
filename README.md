# Hashtune-Marketplace-Server

## Development

Make sure you have .env.local with a DATABASE_URL corresponding to the postgres DB from the docker-compose file.
`yarn` Install dependencies
`docker-compose up -d` Start database
`yarn prisma:migrate` Migrate the database
`yarn prisma:generate` Generate the client
`yarn reflect:nexus:watch` It will generate a GraphQL TYPE file called nexus.ts and a GraphQL schema file called schema.graphql. Do NOT edit these.
`yarn run dev` to start the server on port 5000. Optionally override the port in .env
`yarn seed` in another window to seed the database with a user and artwork to see some data in the playground below
`http://localhost:5000/graphql` for the playground

## Testing
