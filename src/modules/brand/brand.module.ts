import { Module, Logger } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Brand } from '../../entities';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

@Module({
  imports: [MikroOrmModule.forFeature([Brand])],
  providers: [BrandService, Logger],
  controllers: [BrandController],
  exports: [BrandService],
})
export class BrandModule {}
