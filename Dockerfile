###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

RUN npm install typescript ts-node -g

COPY . .


###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

ARG MIKRO_ORM_USER
ARG MIKRO_ORM_PASSWORD
ARG MIKRO_ORM_DB_NAME
ARG MAILJET_API_KEY
ARG MAILJET_SECRET_KEY
ARG JWT_ACCESS_SECRET
ARG JWT_REFRESH_SECRET
ARG OPEN_FOOD_FACTS_URL
ARG SIRENEV3_URL
ARG SIRENEV3_ACCESS_TOKEN

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
RUN echo "MAILJET_API_KEY=$MAILJET_API_KEY" >> .env
RUN echo "MAILJET_SECRET_KEY=$MAILJET_SECRET_KEY" >> .env
RUN echo "JWT_ACCESS_SECRET=$JWT_ACCESS_SECRET" >> .env
RUN echo "JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET" >> .env
RUN echo "OPEN_FOOD_FACTS_URL=$OPEN_FOOD_FACTS_URL" >> .env
RUN echo "SIRENEV3_URL=$SIRENEV3_URL" >> .env
RUN echo "SIRENEV3_ACCESS_TOKEN=$SIRENEV3_ACCESS_TOKEN" >> .env
