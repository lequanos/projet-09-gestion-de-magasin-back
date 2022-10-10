/* eslint-disable prettier/prettier */
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
import { UserService } from '../modules/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly logger: Logger = new Logger('UserService'),
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
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
      user.refreshToken = this.jwtService.sign({}, {secret : process.env.JWT_REFRESH_SECRET}),
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

  async login(user: any) {
    const payload = { mail: user.email, id: user.id };
    return {
      access_token: this.jwtService.sign(payload, {secret : process.env.JWT_ACCESS_SECRET}),
      refreshToken: user.refreshToken,
    };
  }

  async logout(userId: number) {
    return this.userService.updateUserRefreshToken(userId, null);
  }

  // async updateRefreshToken(userId: number, refreshToken: string) {
  //   const hashedRefreshToken: string = await bcrypt.hash(refreshToken, 10);
  //   await this.userService.updateUserRefreshToken(
  //     userId,
  //     hashedRefreshToken,
  //   );
  // }

    async refreshTokens(userId: number, refreshToken: string) {
      console.log('userId', userId);
      const user = await this.userRepository.findOneOrFail(userId);
      console.log('user', user);
      if (!user || !user.refreshToken)
        throw new ForbiddenException('Access Denied, nonono');

      const tokens = await this.getTokens(user.id, user.email);
      console.log('tokens', tokens);
      await this.userService.updateUserRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    }

  async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '60s',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '120s',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
