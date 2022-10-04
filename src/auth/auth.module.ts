import { Module, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../modules/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../entities/User.entity';
import { AppController } from './auth.controller';

@Module({
  imports: [MikroOrmModule.forFeature([User]), UserModule, PassportModule],
  providers: [AuthService, LocalStrategy, Logger],
  controllers: [AppController],
})
export class AuthModule {}
