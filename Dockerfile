FROM mhart/alpine-node:10 as Base

WORKDIR /app

RUN apk add --no-cache make gcc g++ python

COPY package.json yarn.lock ./

RUN yarn install --ignore-engines

COPY . ./

RUN yarn build

FROM mhart/alpine-node:10

WORKDIR /app

COPY --from=Base /app .

EXPOSE 8080

# Sets the command and parameters that will be executed first when a container is ran.
CMD ["yarn", "start"]