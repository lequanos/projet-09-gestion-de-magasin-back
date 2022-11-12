import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from 'src/entities/Role.entity';
import { User } from 'src/entities/User.entity';

import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user }: { user: User } = context.switchToHttp().getRequest();
    console.log(user);
    if (!user)
      throw new UnauthorizedException('Please login to access resource');

    if (
      ['updatePartialProduct', 'updateProduct'].includes(
        context.getHandler().name,
      ) &&
      user.role.name === 'department manager'
    ) {
      const { body } = context.switchToHttp().getRequest();
      Object.keys(body).forEach((key) => {
        if (key !== 'id' && key !== 'inStock') {
          throw new BadRequestException(
            `You are not allowed to update this field : ${key}`,
          );
        }
      });
    }

    return requiredPermissions.some((perm) =>
      user.role?.permissions.includes(perm),
    );
  }
}
