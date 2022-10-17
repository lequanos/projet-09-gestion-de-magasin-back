import { Module, Logger } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Aisle } from '../../entities';
import { AisleController } from './aisle.controller';
import { AisleService } from './aisle.service';

@Module({
  imports: [MikroOrmModule.forFeature([Aisle])],
  providers: [AisleService, Logger],
  controllers: [AisleController],
  exports: [AisleService],
})
export class AisleModule {}
