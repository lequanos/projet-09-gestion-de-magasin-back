import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';
import { Product } from './Product.entity';

@Entity()
export class Stock extends CustomBaseEntity {
  @Property({ type: 'number', nullable: false })
  quantity: number;

  @ManyToOne(() => Product)
  product?: Product;
}
