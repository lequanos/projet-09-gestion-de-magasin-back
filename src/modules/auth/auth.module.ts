import { Module, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from '../../utils/strategies/local.strategy';
import { JwtStrategy } from '../../utils/strategies/jwt.strategy';
import { RefreshTokenStrategy } from '../../utils/strategies/jwt-refresh.strategy';
import { User, Role, Store } from '../../entities';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([User, Role, Store]),
    UserModule,
    PassportModule,
    JwtModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    Logger,
    JwtStrategy,
    RefreshTokenStrategy,
    UserService,
    ConfigService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
