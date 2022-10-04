import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, Module } from '@nestjs/common';
import { Supplier } from '../../entities';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';

@Module({
  imports: [MikroOrmModule.forFeature([Supplier])],
  providers: [SupplierService, Logger],
  controllers: [SupplierController],
  exports: [SupplierService],
})
export class SupplierModule {}
