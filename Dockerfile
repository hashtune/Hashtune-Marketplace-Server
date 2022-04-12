FROM node:14.15.4-alpine3.10 AS base

WORKDIR /app

RUN apk update && apk add bash


COPY package*.json yarn.lock ./

COPY graphql ./graphql

COPY prisma ./prisma

COPY scripts ./scripts

COPY singletons ./singletons

COPY utils ./utils

COPY .env ./.env

COPY .prettierrc ./.prettierrc

COPY constants.ts ./constants.ts

COPY tsconfig.json ./tsconfig.json

COPY tsconfig.prod.json ./tsconfig.prod.json

COPY SongOrAlbumNFT.json ./SongOrAlbumNFT.json

RUN yarn install --frozen-lockfile 

RUN yarn production:prisma:deploy
RUN yarn production:prisma:generate

EXPOSE 5000

RUN yarn build
CMD [ "yarn", "start" ]
