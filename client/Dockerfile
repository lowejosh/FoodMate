FROM node:8.7.0-alpine

RUN mkdir -p /srv/app/foodmate-client
WORKDIR /srv/app/foodmate-client

COPY package.json /srv/app/foodmate-client
COPY package-lock.json /srv/app/foodmate-client

RUN npm install

COPY . /srv/app/foodmate-client

CMD [ "npm", "start "]
