FROM node:16-alpine as builder

WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY ./src ./src
COPY tsconfig.json .
RUN npm run build

FROM node:16-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .
RUN npm i --production
COPY --from=builder /usr/src/app/build ./build
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
