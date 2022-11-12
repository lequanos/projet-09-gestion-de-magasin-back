import { Entity, Property, OneToMany, Collection, Enum } from '@mikro-orm/core';
import { CustomBaseEntity, User } from './';

export enum Permission {
  READ_ALL = 'READ_ALL',
  MANAGE_ALL = 'MANAGE_ALL',
  READ_AISLE = 'READ_AISLE',
  MANAGE_AISLE = 'MANAGE_AISLE',
  READ_BRAND = 'READ_BRAND',
  MANAGE_BRAND = 'MANAGE_BRAND',
  READ_CATEGORY = 'READ_CATEGORY',
  MANAGE_CATEGORY = 'MANAGE_CATEGORY',
  READ_PRODUCT = 'READ_PRODUCT',
  MANAGE_PRODUCT = 'MANAGE_PRODUCT',
  READ_ROLE = 'READ_ROLE',
  MANAGE_ROLE = 'MANAGE_ROLE',
  READ_STOCK = 'READ_STOCK',
  MANAGE_STOCK = 'MANAGE_STOCK',
  READ_STORE = 'READ_STORE',
  MANAGE_STORE = 'MANAGE_STORE',
  READ_SUPPLIER = 'READ_SUPPLIER',
  MANAGE_SUPPLIER = 'MANAGE_SUPPLIER',
  READ_USER = 'READ_USER',
  MANAGE_USER = 'MANAGE_USER',
}

@Entity()
export class Role extends CustomBaseEntity {
  @Property({ type: 'string', nullable: false, length: 64 })
  name: string;

  @OneToMany(() => User, (user) => user.role, {
    orphanRemoval: true,
  })
  users = new Collection<User>(this);

  @Enum({ items: () => Permission, array: true })
  permissions: Permission[];
}
