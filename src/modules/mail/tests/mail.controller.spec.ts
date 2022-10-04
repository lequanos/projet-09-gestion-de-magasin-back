import {
  MailerModule,
  MailerService,
  MAILER_OPTIONS,
} from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from '../mail.controller';
import { MailService } from '../mail.service';

describe('MailController', () => {
  let controller: MailController;

  const mockOptions = {
    transport: {
      secure: true,
      auth: {
        user: 'user@domain.com',
        pass: 'pass',
      },
      options: {
        host: 'smtp.domain.com',
      },
    },
  };
  const mockMailService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailerModule],
      controllers: [MailController],
      providers: [
        MailService,
        Logger,
        MailerService,
        {
          name: MAILER_OPTIONS,
          provide: MAILER_OPTIONS,
          useValue: mockOptions,
        },
      ],
    })
      .overrideProvider(MailService)
      .useValue(mockMailService)
      .compile();

    controller = module.get<MailController>(MailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
