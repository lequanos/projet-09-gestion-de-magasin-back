import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '../entities/User.entity';
import * as bcrypt from 'bcrypt';
import { throwError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    console.log('user 2', email, pass);
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
  }
}
