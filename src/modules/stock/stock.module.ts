import { Module, Logger } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Product, Stock } from '../../entities';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  imports: [MikroOrmModule.forFeature([Stock, Product])],
  providers: [StockService, Logger],
  controllers: [StockController],
  exports: [StockService],
})
export class StockModule {}
