import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';
import { Product } from './Product.entity';

@Entity()
export class Brand extends CustomBaseEntity {
  @Property({ type: 'string', nullable: false, length: 64 })
  name: string;

  @OneToMany(() => Product, (product) => product.brand)
  products = new Collection<Product>(this);
}
