import { Module, Logger } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Role } from '../../entities';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [MikroOrmModule.forFeature([Role])],
  providers: [RoleService, Logger],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
