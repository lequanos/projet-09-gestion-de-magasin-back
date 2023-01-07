import {
  Collection,
  Entity,
  EntityManager,
  Filter,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { CustomBaseEntity, Product, Aisle, User } from './';

@Entity()
@Filter({
  name: 'fromStore',
  cond: async ({ user }: { user: Partial<User> }, _, em: EntityManager) => {
    const aisles = await em.find(Aisle, { store: user.store });

    return { aisle: { $in: [...new Set(aisles)] } };
  },
})
export class Category extends CustomBaseEntity {
  @Property({ type: 'string', nullable: false, length: 64 })
  name: string;

  @ManyToOne(() => Aisle, { nullable: true })
  aisle: Aisle;

  @ManyToMany(() => Product, (product) => product.categories)
  products = new Collection<Product>(this);
}
