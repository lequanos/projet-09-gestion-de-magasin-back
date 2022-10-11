import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../../entities';

@Injectable()
export class StoreInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { user, body }: { user: User; body: any } = context
      .switchToHttp()
      .getRequest();

    if (!user) throw new UnauthorizedException('Please login');
    if (!body) throw new BadRequestException('Please provide a payload');

    if (user?.role.name !== 'super admin') {
      body.store = user.store.id;
    } else if (user?.role.name === 'super admin' && !body.store) {
      throw new BadRequestException('Please provide a store for the resource');
    }

    return next.handle();
  }
}
