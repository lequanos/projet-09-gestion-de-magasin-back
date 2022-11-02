import {
  Entity,
  Property,
  OneToMany,
  Collection,
  Cascade,
} from '@mikro-orm/core';
import { CustomBaseEntity, Aisle, User } from './';
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

  @OneToMany(() => User, (user) => user.store, {
    orphanRemoval: true,
  })
  users = new Collection<User>(this);

  @OneToMany(() => Aisle, (aisle) => aisle.store, {
    orphanRemoval: true,
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
  })
  aisles = new Collection<Aisle>(this);
}
