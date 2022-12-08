import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { CustomBaseEntity, Product } from './';

@Entity()
export class Brand extends CustomBaseEntity {
  constructor(brandName: string) {
    super();
    this.name = brandName;
  }

  @Property({ type: 'string', nullable: false, length: 64 })
  name: string;

  @OneToMany(() => Product, (product) => product.brand, {
    orphanRemoval: true,
  })
  products = new Collection<Product>(this);
}
