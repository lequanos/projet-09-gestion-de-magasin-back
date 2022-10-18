import { Logger, Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Product, Brand, Stock, ProductSupplier } from '../../entities';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([Product, Brand, Stock, ProductSupplier]),
  ],
  providers: [ProductService, Logger],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
