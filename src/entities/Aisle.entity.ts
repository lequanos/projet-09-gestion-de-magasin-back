import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { Category } from './Category.entity';
import { CustomBaseEntity } from './CustomBaseEntity';
import { Store } from './Store.entity';
import { User } from './User.entity';

@Entity()
export class Aisle extends CustomBaseEntity {
  @Property({ type: 'string', nullable: false, length: 64 })
  name: string;

  @ManyToOne(() => Store)
  store!: Store;

  @ManyToMany({ entity: () => User, mappedBy: 'aisles' })
  users = new Collection<User>(this);

  @OneToMany(() => Category, (category) => category.aisle)
  categories = new Collection<Category>(this);
}
