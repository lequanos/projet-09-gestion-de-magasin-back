import {
  Entity,
  ManyToOne,
  PrimaryKeyType,
  Property,
  types,
} from '@mikro-orm/core';
import { Product, Supplier } from './';

@Entity()
export class ProductSupplier {
  @Property({ type: types.float, nullable: false, default: 0 })
  purchasePrice: number;

  @ManyToOne({ primary: true })
  supplier: Supplier;

  @ManyToOne({ primary: true })
  product: Product;

  @Property({ defaultRaw: 'now()' })
  createdAt: Date;

  @Property({ defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt: Date;

  [PrimaryKeyType]?: [number, number];

  constructor(supplier: Supplier, product: Product, purchasePrice: number) {
    this.supplier = supplier;
    this.product = product;
    this.purchasePrice = purchasePrice;
  }
}
