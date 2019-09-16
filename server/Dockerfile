FROM node:8.7.0-alpine

RUN mkdir -p /srv/app/foodmate-server
WORKDIR /srv/app/foodmate-server

COPY package.json /srv/app/foodmate-server
COPY package-lock.json /srv/app/foodmate-server

RUN npm install

COPY . /srv/app/foodmate-server

CMD [ "node", "index.js"]
