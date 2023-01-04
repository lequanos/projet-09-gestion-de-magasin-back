import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, Module } from '@nestjs/common';
import { Supplier } from '../../entities';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MikroOrmModule.forFeature([Supplier]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: 5000,
        maxRedirects: 5,
        baseURL: configService.get('SIRENEV3_URL'),
        headers: {
          Authorization: 'Bearer ' + configService.get('SIRENEV3_ACCESS_TOKEN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SupplierService, Logger],
  controllers: [SupplierController],
  exports: [SupplierService],
})
export class SupplierModule {}
