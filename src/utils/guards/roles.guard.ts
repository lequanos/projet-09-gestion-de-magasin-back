import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from '../../entities';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user }: { user: User } = context.switchToHttp().getRequest();

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
        if (
          (key !== 'id' &&
            key !== 'inStock' &&
            key === 'categories' &&
            !body[key].length) ||
          (key === 'productSuppliers' && !body[key].length)
        ) {
          throw new BadRequestException(
            `You are not allowed to update this field : ${key}`,
          );
        }
      });
    }

    return requiredRoles.some((role) => user.role?.name === role);
  }
}
