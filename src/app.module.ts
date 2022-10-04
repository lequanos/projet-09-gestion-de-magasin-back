import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './mikro-orm.config';
import { ConfigModule } from '@nestjs/config';

import { SupplierController } from './modules/supplier/supplier.controller';
import { SupplierModule } from './modules/supplier/supplier.module';
import { StoreController } from './modules/store/store.controller';
import { StoreModule } from './modules/store/store.module';
import { AuthenticationModule } from './modules/auth/authentication.module';
import { AuthenticationController } from './modules/auth/authentication.controller';


@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    SupplierModule,
    StoreModule,
    AuthenticationModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [StoreController, SupplierController, AuthenticationController],
  providers: [],
})
export class AppModule {}
