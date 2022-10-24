## Description

API for the Retail Store project.

## Installation

```bash
$ npm install
```

## Running the app

Create a .env file following the .env.example

```bash
# development
$ docker compose --env-file .env

# production mode
$ docker compose --env-file .env -f docker-compose.yaml -f docker-compose.prod.yaml up -d
```

## Migrations

```bash
# Migrate the db to the latest version
$ npx mikro-orm migration:up

# Drop schema, migrate to the latest version of db and run the seeder
$ npx mikro-orm migration:fresh --seed

```

## Test

```bash
# unit tests
$ npm run test

```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
