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

WORKDIR /usr/src/app

COPY package*.json ./

COPY --from=development /usr/src/app/node_modules ./node_modules

COPY . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force