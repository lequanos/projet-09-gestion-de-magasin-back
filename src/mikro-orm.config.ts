import { Logger } from '@nestjs/common';
import { Options } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import {
  CustomBaseEntity,
  Store,
  Supplier,
  User,
  Product,
  Brand,
  Aisle,
  Category,
  ProductSupplier,
  Stock,
} from './entities';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TSMigrationGenerator } from '@mikro-orm/migrations';

const logger = new Logger('MikroORM');

const config: Options<PostgreSqlDriver> = {
  entities: [
    CustomBaseEntity,
    Store,
    Supplier,
    User,
    Product,
    Brand,
    Aisle,
    Category,
    ProductSupplier,
    Stock,
  ],
  seeder: {
    path: './dist/seeders',
    pathTs: './seeders',
    defaultSeeder: 'FakeDataSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
    fileName: (className: string) => className,
  },
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: './dist/migrations',
    pathTs: './migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    disableForeignKeys: true,
    allOrNothing: true,
    dropTables: false,
    safe: false,
    snapshot: true,
    emit: 'ts',
    generator: TSMigrationGenerator,
  },
  type: 'postgresql',
  highlighter: new SqlHighlighter(),
  port: 5432,
  debug: true,
  host: 'localhost',
  logger: logger.log.bind(logger),
  metadataProvider: TsMorphMetadataProvider,
};

export default config;
