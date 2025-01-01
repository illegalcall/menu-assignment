FROM node:18-alpine

# Install OpenSSL 1.1.x
RUN apt-get update && apt-get install -y libssl1.1

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 4000

CMD yarn run start:dev
