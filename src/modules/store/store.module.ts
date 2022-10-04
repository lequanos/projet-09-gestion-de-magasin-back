import { Module, Logger } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Store } from '../../entities';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [MikroOrmModule.forFeature([Store])],
  providers: [StoreService, Logger],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}
