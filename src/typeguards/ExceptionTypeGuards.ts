import { NotFoundError } from '@mikro-orm/core';

export function isNotFoundError(e: Error): e is NotFoundError {
  return (e as NotFoundError).message.includes('not found');
}
