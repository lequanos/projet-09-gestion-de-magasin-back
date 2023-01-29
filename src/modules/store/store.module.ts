import { Module, Logger } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Store, Aisle, Role, User } from '../../entities';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoleService } from '../role/role.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Store, Aisle, Role, User]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: 5000,
        maxRedirects: 5,
        baseURL: configService.get('SIRENEV3_URL'),
        headers: {
          Authorization: 'Bearer ' + configService.get('SIRENEV3_ACCESS_TOKEN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [StoreService, Logger, RoleService],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}
