import {
  Collection,
  Entity,
  Filter,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { CustomBaseEntity, Product, ProductSupplier, Store, User } from './';
@Entity()
@Filter({
  name: 'fromStore',
  cond: ({ user }: { user: Partial<User> }) => {
    if (user?.role?.name === 'super admin') return;
    return { store: user.store };
  },
})
export class Supplier extends CustomBaseEntity {
  @Property({ type: 'string', nullable: false, length: 64 })
  name: string;

  @Property({ type: 'string', nullable: false, length: 10 })
  phoneNumber: string;

  @Property({ type: 'string', nullable: false, length: 150 })
  address: string;

  @Property({ type: 'string', nullable: false, length: 5 })
  postcode: string;

  @Property({ type: 'string', nullable: false, length: 64 })
  city: string;

  @Property({ type: 'string', nullable: false, length: 9 })
  siren: string;

  @Property({ type: 'string', nullable: true, length: 14 })
  siret: string;

  @Property({ type: 'string', nullable: true, length: 64 })
  contact: string;

  @Property({ type: 'boolean', nullable: false })
  isActive: boolean;

  @Property({ type: 'string', nullable: true, default: 'pictureStore' })
  pictureUrl: string;

  @ManyToMany({ entity: () => Product, pivotEntity: () => ProductSupplier })
  products = new Collection<Product>(this);

  @ManyToOne(() => Store)
  store: Store;
}
