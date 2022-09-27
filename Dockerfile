###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

ARG MIKRO_ORM_USER

ARG MIKRO_ORM_PASSWORD

ARG MIKRO_ORM_DB_NAME

WORKDIR /usr/src/app

COPY package*.json ./

COPY --from=development /usr/src/app/node_modules ./node_modules

COPY . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

RUN npm install typescript ts-node -g

RUN touch .env

RUN echo "MIKRO_ORM_USER=$MIKRO_ORM_USER" >> .env
RUN echo "MIKRO_ORM_PASSWORD=$MIKRO_ORM_PASSWORD" >> .env
RUN echo "MIKRO_ORM_DB_NAME=$MIKRO_ORM_DB_NAME" >> .env