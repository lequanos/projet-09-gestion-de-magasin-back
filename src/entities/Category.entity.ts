import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { Aisle } from './Aisle.entity';
import { CustomBaseEntity } from './CustomBaseEntity';
import { Product } from './Product.entity';

@Entity()
export class Category extends CustomBaseEntity {
  @Property({ type: 'string', nullable: false, length: 64 })
  name: string;

  @ManyToOne(() => Aisle, { mapToPk: true, nullable: true })
  aisle: Aisle;

  @ManyToMany(() => Product, (product) => product.categories)
  products = new Collection<Product>(this);
}
