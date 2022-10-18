import {
  Entity,
  Property,
  Enum,
  OneToMany,
  Collection,
  ManyToMany,
  ManyToOne,
  Filter,
  types,
  Formula,
  Cascade,
} from '@mikro-orm/core';

import {
  CustomBaseEntity,
  Category,
  Stock,
  ProductSupplier,
  Brand,
  Supplier,
  Store,
  User,
} from './';

@Entity()
@Filter({
  name: 'fromStore',
  cond: ({ user }: { user: Partial<User> }) => {
    if (user?.role?.name === 'super admin') return;
    return { store: user.store };
  },
})
export class Product extends CustomBaseEntity {
  @Property({ type: 'string', nullable: false, length: 64 })
  name: string;

  @Property({ type: 'string', nullable: false, length: 13 })
  code: string;

  @Property({ type: types.float, nullable: false, default: 0, length: 150 })
  price: number;

  @Property({ type: 'string', nullable: true, default: 'pictureStore' })
  pictureUrl: string;

  @Enum({ items: () => ProductNutriscore, type: 'string', nullable: false })
  nutriScore: ProductNutriscore;

  @Enum({ items: () => ProductEcoscore, type: 'string', nullable: false })
  ecoScore: ProductEcoscore;

  @Property({ type: 'string', nullable: false, length: 10 })
  unitPackaging: string;

  @Property({ type: 'number', nullable: false, default: 0 })
  threshold: number;

  @Property({ type: 'string' })
  ingredients: string;

  @Property({ type: 'boolean', nullable: false })
  isActive: boolean;

  @OneToMany(() => Stock, (stock) => stock.product, {
    orphanRemoval: true,
    cascade: [Cascade.REMOVE],
  })
  stock = new Collection<Stock>(this);

  @ManyToOne(() => Brand)
  brand: Brand;

  @ManyToMany({
    entity: () => Category,
    mappedBy: 'products',
    owner: true,
  })
  categories = new Collection<Category>(this);

  @ManyToMany({
    entity: () => Supplier,
    pivotEntity: () => ProductSupplier,
    cascade: [Cascade.REMOVE],
  })
  suppliers = new Collection<Supplier>(this);

  @ManyToOne(() => Store)
  store: Store;

  @Formula(
    (alias) =>
      `(SELECT SUM(stock.quantity) FROM stock WHERE stock.product_id = ${alias}.id)`,
  )
  inStock: number;

  @OneToMany(
    () => ProductSupplier,
    (productSupplier) => productSupplier.product,
    {
      orphanRemoval: true,
      cascade: [Cascade.REMOVE],
    },
  )
  productSuppliers = new Collection<ProductSupplier>(this);
}

export enum ProductNutriscore {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
}

export enum ProductEcoscore {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
}
