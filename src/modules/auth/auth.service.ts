import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';

import { User } from '../../entities/User.entity';
import { isNotFoundError } from '../../utils/typeguards/ExceptionTypeGuards';
import { TokensDto } from './auth.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly logger: Logger = new Logger('AuthService'),
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
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
            'store',
          ],
        },
      );

      const result = await bcrypt.compare(password, user.password);
      if (!result) {
        throw new ForbiddenException('Invalid credentials');
      }
      user.refreshToken = this.jwtService.sign(
        {},
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '1d',
        },
      );
      await this.userRepository.persistAndFlush(user);
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

  async login(user: User): Promise<TokensDto> {
    const payload = {
      mail: user.email,
      id: user.id,
      role: {
        id: user.role.id,
        name: user.role.name,
      },
      store: user.store ? { id: user.store.id } : null,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      }),
      refresh_token: user.refreshToken,
    };
  }

  async logout(userId: number) {
    return this.userService.updateUserRefreshToken(userId, null);
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOneOrFail({
      id: userId,
      refreshToken,
    });

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied, nonono');

    const tokens = await this.getTokens(user);

    await this.userService.updateUserRefreshToken(
      user.id,
      tokens.refresh_token,
    );
    return tokens;
  }

  async getTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          mail: user.email,
          id: user.id,
          role: user.role,
          store: user.store,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '60s',
        },
      ),
      this.jwtService.signAsync(
        {},
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '1d',
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
