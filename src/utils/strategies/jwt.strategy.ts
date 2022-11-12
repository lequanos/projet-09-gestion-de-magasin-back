import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../../modules/user/user.service';
import { JwtDto } from '../../modules/auth/auth.dto';
import { EntityManager } from '@mikro-orm/core';
import { Permission } from '../../entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly em: EntityManager,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: JwtDto) {
    const user = await this.userService.getOneById(
      payload.id,
      {
        role: payload.role,
        store: payload.role.permissions.includes(Permission.READ_ALL)
          ? undefined
          : payload.store,
      },
      [
        'firstname',
        'lastname',
        'email',
        'pictureUrl',
        'role',
        'store',
        'aisles',
        'refreshToken',
      ],
      ['role.name', 'role.permissions', 'aisles.name'],
      true,
    );
    user.store = payload.store;

    this.em.clear();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
