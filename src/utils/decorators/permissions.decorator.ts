import { SetMetadata } from '@nestjs/common';
import { Permission } from 'src/entities';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: Permission[]) => {
  console.log(permissions)
  return SetMetadata(PERMISSIONS_KEY, permissions);
}
