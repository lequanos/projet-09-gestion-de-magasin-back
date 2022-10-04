import { getRepositoryToken } from '@mikro-orm/nestjs';
import { MailerService, MAILER_OPTIONS } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../../entities';
import { MailService } from '../mail.service';

describe('MailService', () => {
  let service: MailService;

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
  const mockUserRepository = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        MailerService,
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          name: MAILER_OPTIONS,
          provide: MAILER_OPTIONS,
          useValue: mockOptions,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
