import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { User } from '../entities/User.entity';
import * as bcrypt from 'bcrypt';
import { throwError } from 'rxjs';
import { isNotFoundError } from 'src/typeguards/ExceptionTypeGuards';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly logger: Logger = new Logger('UserService'),
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.userRepository.findOneOrFail(
        { email, isActive: true },
        {
          fields: [
            'firstname',
            'lastname',
            'email',
            'pictureUrl',
            'role',
            'password',
            {
              role: ['name'],
            },
            {
              aisles: ['name'],
            },
          ],
        },
      );

      const result = await bcrypt.compare(pass, user.password);
      if (!result) {
        throw new ForbiddenException('Invalid credentials');
      }
      user.password = '';

      return user;
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new ForbiddenException('Invalid credentials');
      }

      throw e;
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
