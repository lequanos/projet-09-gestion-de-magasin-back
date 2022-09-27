import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Store } from 'src/entities';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [MikroOrmModule.forFeature([Store])],
  providers: [StoreService],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}
