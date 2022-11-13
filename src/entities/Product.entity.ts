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
  TextType,
  EntityManager,
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
  Aisle,
  Permission,
} from './';

@Entity()
@Filter({
  name: 'fromStore',
  cond: ({ user }: { user: Partial<User> }) => ({ store: user.store }),
})
@Filter({
  name: 'fromAisles',
  cond: async ({ user }: { user: Partial<User> }, _, em: EntityManager) => {
    if (user?.role?.permissions.includes(Permission.READ_ALL)) return;
    if (user?.aisles?.toArray().find((aisle) => aisle.name === 'All')) return;
    let categories: number[] = [];
    let aisles: Aisle[] = [];

    if (user.aisles) {
      aisles = await em.find(
        Aisle,
        { id: { $in: [...user.aisles.toArray().map((x) => x.id)] } },
        { populate: ['categories'] },
      );
    }

    aisles.forEach((aisle) => {
      categories = [
        ...categories,
        ...(aisle.categories?.toArray().map((cat) => cat.id) || []),
      ];
    });
    return { categories: { $in: [...new Set(categories)] } };
  },
})
export class Product extends CustomBaseEntity {
  @Property({ type: TextType, nullable: false })
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

  @Property({ type: TextType })
  ingredients: string;

  @Property({ type: 'boolean', nullable: false })
  isActive: boolean;

  @OneToMany(() => Stock, (stock) => stock.product, {
    orphanRemoval: true,
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
  })
  suppliers = new Collection<Supplier>(this);

  @ManyToOne({ entity: () => Store, onDelete: 'cascade' })
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
  'NOT-APPLICABLE' = 'NOT-APPLICABLE',
}

export enum ProductEcoscore {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  'NOT-APPLICABLE' = 'NOT-APPLICABLE',
}
