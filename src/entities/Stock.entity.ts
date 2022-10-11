import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { CustomBaseEntity, Product } from './';

@Entity()
export class Stock extends CustomBaseEntity {
  @Property({ type: 'number', nullable: false })
  quantity: number;

  @ManyToOne(() => Product)
  product?: Product;
}
