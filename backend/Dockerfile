FROM node:18-alpine AS base

FROM base AS dependencies

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN yarn gen:prisma
RUN yarn build

FROM base AS deploy

WORKDIR /app
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules

CMD [ "node", "dist/main.js" ]