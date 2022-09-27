import {
  Entity,
  Property,
  Enum,
  OneToMany,
  Collection,
  ManyToMany,
  ManyToOne,
  types,
} from '@mikro-orm/core';
import { Category } from './Category.entity';
import { CustomBaseEntity } from './CustomBaseEntity';
import { Stock } from './Stock.entity';
import { ProductSupplier } from './ProductSupplier.entity';
import { Brand } from './Brand.entity';
import { Supplier } from './Supplier.entity';

@Entity()
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

  @OneToMany(() => Stock, (stock) => stock.product)
  stock = new Collection<Stock>(this);

  @ManyToOne(() => Brand)
  brand?: Brand;

  @ManyToMany(() => Category, 'products', { owner: true })
  categories = new Collection<Category>(this);

  @ManyToMany({ entity: () => Supplier, pivotEntity: () => ProductSupplier })
  suppliers = new Collection<Supplier>(this);
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
