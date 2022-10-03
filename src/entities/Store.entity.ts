import { Entity, Property, OneToMany, Collection } from '@mikro-orm/core';
import { DEFAULT_FACTORY_CLASS_METHOD_KEY } from '@nestjs/common/module-utils/constants';
import { Aisle } from './Aisle.entity';
import { CustomBaseEntity } from './CustomBaseEntity';
import { User } from './User.entity';
@Entity()
export class Store extends CustomBaseEntity {
  @Property({ type: 'string', nullable: false, length: 64 })
  name: string;

  @Property({ type: 'string', nullable: false, length: 150 })
  address: string;

  @Property({ type: 'string', nullable: false, length: 5 })
  postcode: string;

  @Property({ type: 'string', nullable: false, length: 64 })
  city: string;

  @Property({ type: 'string', nullable: false, length: 9 })
  siren: string;

  @Property({ type: 'string', nullable: false, length: 14, unique: true })
  siret: string;

  @Property({ type: 'boolean', nullable: false })
  isActive: boolean;

  @Property({ type: 'string', nullable: true, default: 'pictureStore' })
  pictureUrl: string;

  @OneToMany(() => User, (user) => user.store)
  users = new Collection<User>(this);

  @OneToMany(() => Aisle, (aisle) => aisle.store)
  aisles = new Collection<Aisle>(this);
}
