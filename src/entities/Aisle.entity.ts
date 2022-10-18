import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
  Filter,
  Cascade,
} from '@mikro-orm/core';
import { CustomBaseEntity, Category, User, Store } from './';

@Entity()
@Filter({
  name: 'fromStore',
  cond: ({ user }: { user: Partial<User> }) => {
    if (user?.role?.name === 'super admin') return;
    return { store: user.store };
  },
})
export class Aisle extends CustomBaseEntity {
  @Property({ type: 'string', nullable: false, length: 64 })
  name: string;

  @ManyToOne(() => Store)
  store!: Store;

  @ManyToMany({
    entity: () => User,
    mappedBy: 'aisles',
  })
  users = new Collection<User>(this);

  @OneToMany(() => Category, (category) => category.aisle, {
    orphanRemoval: true,
    cascade: [Cascade.REMOVE],
  })
  categories = new Collection<Category>(this);
}
