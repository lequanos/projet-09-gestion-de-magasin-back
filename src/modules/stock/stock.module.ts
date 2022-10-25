import { Module, Logger } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Product, Stock, User } from '../../entities';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [MikroOrmModule.forFeature([Stock, Product, User])],
  providers: [StockService, MailService, Logger],
  controllers: [StockController],
  exports: [StockService],
})
export class StockModule {}
