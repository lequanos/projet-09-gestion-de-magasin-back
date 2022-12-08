import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Product, Brand, Stock, Aisle, Category, User } from '../../entities';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MailService } from '../mail/mail.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MikroOrmModule.forFeature([Product, Brand, Stock, Aisle, Category, User]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: 5000,
        maxRedirects: 5,
        baseURL: configService.get('OPEN_FOOD_FACTS_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ProductService, MailService, Logger],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
