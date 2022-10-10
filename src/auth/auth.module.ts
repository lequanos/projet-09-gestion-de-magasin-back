import { Module, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../modules/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../entities/User.entity';
import { Role } from 'src/entities/Role.entity';
import { Store } from 'src/entities/Store.entity';
import { AppController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { RefreshTokenStrategy } from './jwt.refreshStrategy';
import { UserService } from 'src/modules/user/user.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MikroOrmModule.forFeature([User, Role, Store]),
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
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
  controllers: [AppController],
  exports: [AuthService],
})
export class AuthModule {}
