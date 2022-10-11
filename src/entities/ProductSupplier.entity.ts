import { Entity, ManyToOne, Property, types } from '@mikro-orm/core';
import { CustomBaseEntity, Product, Supplier } from './';

@Entity()
export class ProductSupplier extends CustomBaseEntity {
  @Property({ type: types.float, nullable: false })
  purchasePrice: number;

  @ManyToOne({ primary: true })
  supplier: Supplier;

  @ManyToOne({ primary: true })
  product: Product;
}
