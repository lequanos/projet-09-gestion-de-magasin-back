import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './mikro-orm.config';
import { ConfigModule } from '@nestjs/config';
import { SupplierController } from './modules/supplier/supplier.controller';
import { SupplierModule } from './modules/supplier/supplier.module';
import { StoreController } from './modules/store/store.controller';
import { StoreModule } from './modules/store/store.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    SupplierModule,
    StoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [StoreController, SupplierController],
  providers: [],
})
export class AppModule {}
