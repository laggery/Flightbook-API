FROM node:lts-alpine as dist
WORKDIR /tmp/
COPY package.json package-lock.json tsconfig.json tsconfig.build.json ./
COPY src/ src/
RUN npm install
RUN npm run build

FROM node:lts-alpine as node_modules
RUN apk add g++ make python
WORKDIR /tmp/
COPY package.json package-lock.json ./
RUN npm install --production

FROM node:lts-alpine
WORKDIR /usr/local/nub-api
COPY --from=node_modules /tmp/node_modules ./node_modules
COPY --from=dist /tmp/dist ./dist
CMD ["node", "dist/main.js"]
