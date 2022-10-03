import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, Logger } from '@nestjs/common';
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
