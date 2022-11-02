import {
  Entity,
  Property,
  ManyToOne,
  ManyToMany,
  Collection,
  Filter,
} from '@mikro-orm/core';
import { Aisle } from './Aisle.entity';
import { CustomBaseEntity } from './CustomBaseEntity';
import { Role } from './Role.entity';
import { Store } from './Store.entity';

@Entity()
@Filter({
  name: 'fromStore',
  cond: ({ user }: { user: Partial<User> }) => {
    if (user?.role?.name === 'super admin') return;
    return { store: user.store };
  },
})
export class User extends CustomBaseEntity {
  @Property({ type: 'string', nullable: false, length: 64 })
  firstname: string;

  @Property({ type: 'string', nullable: false, length: 64 })
  lastname: string;

  @Property({ type: 'string', nullable: false, length: 150, unique: true })
  email: string;

  @Property({ type: 'string', nullable: false, length: 64 })
  password: string;

  @Property({ type: 'boolean', nullable: false })
  isActive: boolean;

  @Property({ type: 'string', nullable: true, default: 'pictureStore' })
  pictureUrl: string;

  @Property({ type: 'string', nullable: true })
  refreshToken: string;

  @ManyToOne(() => Role)
  role: Role;

  @ManyToOne({ entity: () => Store, onDelete: 'cascade', nullable: true })
  store: Store;

  @ManyToMany({ entity: () => Aisle, inversedBy: 'users' })
  aisles = new Collection<Aisle>(this);
}
