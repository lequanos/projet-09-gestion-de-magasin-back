import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-http-bearer';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  validate(token: string) {
    const payload = this.jwtService.verify(token, {secret: process.env.JWT_REFRESH_SECRET});
    if (!payload) {
      throw new ForbiddenException('Invalid token');
    }
    const user = this.userService.getOneByRefreshToken(token);

    return user;
  }
}
