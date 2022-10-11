import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { CustomBaseEntity, Product, Aisle } from './';

@Entity()
export class Category extends CustomBaseEntity {
  @Property({ type: 'string', nullable: false, length: 64 })
  name: string;

  @ManyToOne(() => Aisle, { mapToPk: true, nullable: true })
  aisle: Aisle;

  @ManyToMany(() => Product, (product) => product.categories)
  products = new Collection<Product>(this);
}
