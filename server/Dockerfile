FROM node:lts-slim

RUN mkdir -p /usr/src/app/server

WORKDIR /usr/src/app/server

EXPOSE 8001

COPY package.json /usr/src/app/server
COPY package-lock.json /usr/src/app/server
COPY index.js /usr/src/app/server
COPY firebase /usr/src/app/server/firebase
COPY .env /usr/src/app/server/

RUN npm install

CMD [ "npm", "run", "dev" ]
