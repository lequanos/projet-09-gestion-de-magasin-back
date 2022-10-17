import { Module, Logger } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Category } from '../../entities';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [MikroOrmModule.forFeature([Category])],
  providers: [CategoryService, Logger],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
