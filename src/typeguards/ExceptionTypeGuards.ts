import { NotFoundError } from '@mikro-orm/core';
import { UnauthorizedException } from '@nestjs/common';

export function isNotFoundError(e: Error): e is NotFoundError {
  return (
    (e as NotFoundError).message.includes('not found') ||
    (e as NotFoundError).message.includes('404')
  );
}

export function isUnauthorizedException(e: Error): e is UnauthorizedException {
  return (e as UnauthorizedException).message.includes('401');
}
