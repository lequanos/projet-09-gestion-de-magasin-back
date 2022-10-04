import { Module, Logger } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../../entities';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [MailService, Logger],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
