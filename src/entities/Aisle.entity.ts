import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
  Filter,
} from '@mikro-orm/core';
import { CustomBaseEntity, Category, User, Store } from './';

@Entity()
@Filter({
  name: 'fromStore',
  cond: ({ user }: { user: Partial<User> }) => ({ store: user.store }),
})
export class Aisle extends CustomBaseEntity {
  @Property({ type: 'string', nullable: false, length: 64 })
  name: string;

  @ManyToOne({ entity: () => Store, onDelete: 'cascade' })
  store!: Store;

  @ManyToMany({
    entity: () => User,
    mappedBy: 'aisles',
  })
  users = new Collection<User>(this);

  @OneToMany(() => Category, (category) => category.aisle, {
    orphanRemoval: true,
  })
  categories = new Collection<Category>(this);
}
