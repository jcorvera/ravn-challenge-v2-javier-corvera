FROM node:18-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --silent --frozen-lockfile --network-timeout=1000000000
COPY . .
RUN yarn run build
EXPOSE 3000
CMD ["node", "dist/main"]