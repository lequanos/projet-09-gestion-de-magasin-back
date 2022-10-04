import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities';
import { isNotFoundError } from 'src/typeguards/ExceptionTypeGuards';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly logger: Logger = new Logger('AuthenticationService'),
  ) {}

  async findByMail(email: User): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({ email });
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }
}
