import { Entity, Property, OneToMany, Collection } from '@mikro-orm/core';
import { CustomBaseEntity, User } from './';

@Entity()
export class Role extends CustomBaseEntity {
  @Property({ type: 'string', nullable: false, length: 64 })
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users = new Collection<User>(this);
}
