FROM node:lts-slim

RUN mkdir -p /usr/src/app/client

WORKDIR /usr/src/app/client

EXPOSE 3000

COPY package.json /usr/src/app/client
COPY package-lock.json /usr/src/app/client
COPY public /usr/src/app/client/public
COPY src /usr/src/app/client/src

RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent

CMD ["npm", "start"]
