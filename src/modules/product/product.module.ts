import { Logger, Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Product, Brand, Stock, Aisle, Category, User } from '../../entities';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Product, Brand, Stock, Aisle, Category, User]),
  ],
  providers: [ProductService, MailService, Logger],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
