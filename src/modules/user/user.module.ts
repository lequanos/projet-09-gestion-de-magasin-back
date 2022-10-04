import { Logger, Module } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { User, Role, Store } from '../../entities';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MikroOrmModule.forFeature([User, Role, Store])],
  providers: [UserService, Logger],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
