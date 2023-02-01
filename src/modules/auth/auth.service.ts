import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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
              role: ['name', 'permissions'],
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
        throw new UnauthorizedException('Invalid credentials');
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
        throw new UnauthorizedException('Invalid credentials');
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
        permissions: user.role.permissions,
      },
      store: user.store ? { id: user.store.id } : null,
      aisles: user.aisles,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '10m',
      }),
      refresh_token: user.refreshToken,
    };
  }

  async logout(userId: number) {
    return this.userService.updateUserRefreshToken(userId, null);
  }

  async refreshTokens(user: User) {
    const foundUser = await this.userRepository.findOneOrFail({
      id: user.id,
      refreshToken: user.refreshToken,
    });

    if (!foundUser || !foundUser.refreshToken)
      throw new UnauthorizedException('Access Denied, nonono');

    if (!foundUser.isActive)
      throw new UnauthorizedException('Your account has been deactivated');

    const tokens = await this.getTokens(foundUser, user.store.id);

    await this.userService.updateUserRefreshToken(
      user.id,
      tokens.refresh_token,
    );
    return tokens;
  }

  async getTokens(user: User, storeId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          mail: user.email,
          id: user.id,
          role: {
            id: user.role.id,
            name: user.role.name,
            permissions: user.role.permissions,
          },
          store: user.store
            ? { id: user.store.id }
            : storeId
            ? { id: storeId }
            : null,
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

  async selectStore(user: User, store: number): Promise<TokensDto> {
    const payload = {
      mail: user.email,
      id: user.id,
      role: {
        id: user.role.id,
        name: user.role.name,
        permissions: user.role.permissions,
      },
      store: { id: store },
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      }),
      refresh_token: user.refreshToken,
    };
  }
}
