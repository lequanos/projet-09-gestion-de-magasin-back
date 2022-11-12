import { Module, Logger } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Store, Aisle, Role } from '../../entities';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [MikroOrmModule.forFeature([Store, Aisle, Role])],
  providers: [StoreService, Logger],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}
