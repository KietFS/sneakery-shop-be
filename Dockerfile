FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install yarn
RUN yarn install

COPY . .

RUN yarn run build

EXPOSE 4000

CMD [ "yarn", "server-ts" ]
