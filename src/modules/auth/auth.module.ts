import { Module, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../../utils/strategies/local.strategy';
import { JwtStrategy } from '../../utils/strategies/jwt.strategy';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../../entities/User.entity';
import { Role } from 'src/entities/Role.entity';
import { AuthController } from './auth.controller';
import { Store } from 'src/entities/Store.entity';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenStrategy } from '../../utils/strategies/jwt-refresh.strategy';
import { UserService } from 'src/modules/user/user.service';
import { ConfigService } from '@nestjs/config';

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
