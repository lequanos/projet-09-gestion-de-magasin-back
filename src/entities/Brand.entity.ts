import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { CustomBaseEntity, Product } from './';

@Entity()
export class Brand extends CustomBaseEntity {
  @Property({ type: 'string', nullable: false, length: 64 })
  name: string;

  @OneToMany(() => Product, (product) => product.brand, {
    orphanRemoval: true,
  })
  products = new Collection<Product>(this);
}
