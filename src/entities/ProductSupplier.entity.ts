import { Entity, ManyToOne, Property, types } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';
import { Product } from './Product.entity';
import { Supplier } from './Supplier.entity';

@Entity()
export class ProductSupplier extends CustomBaseEntity {
  @Property({ type: types.float, nullable: false })
  purchasePrice: number;

  @ManyToOne({ primary: true })
  supplier: Supplier;

  @ManyToOne({ primary: true })
  product: Product;
}
