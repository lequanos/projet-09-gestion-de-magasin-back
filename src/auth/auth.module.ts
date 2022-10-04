import { Module, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../modules/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../entities/User.entity';
import { AppController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, Logger, JwtStrategy],
  controllers: [AppController],
  exports: [AuthService],
})
export class AuthModule {}
