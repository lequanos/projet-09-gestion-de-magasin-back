import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './mikro-orm.config';
import { ConfigModule } from '@nestjs/config';
import { SupplierController } from './modules/supplier/supplier.controller';
import { SupplierModule } from './modules/supplier/supplier.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    SupplierModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [SupplierController],
  providers: [],
})
export class AppModule {}
