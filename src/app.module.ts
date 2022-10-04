import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './mikro-orm.config';
import { ConfigModule } from '@nestjs/config';

import { SupplierController } from './modules/supplier/supplier.controller';
import { SupplierModule } from './modules/supplier/supplier.module';
import { StoreController } from './modules/store/store.controller';
import { StoreModule } from './modules/store/store.module';
import { UserController } from './modules/user/user.controller';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    SupplierModule,
    StoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
  ],
  controllers: [StoreController, SupplierController, UserController],
  providers: [],
})
export class AppModule {}
