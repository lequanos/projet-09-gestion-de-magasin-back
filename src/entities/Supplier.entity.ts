import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';
import { Product } from './Product.entity';
import { ProductSupplier } from './ProductSupplier.entity';

@Entity()
export class Supplier extends CustomBaseEntity {
  @Property({ type: 'string', nullable: false, length: 64 })
  name: string;

  @Property({ type: 'string', nullable: false, length: 10 })
  phoneNumber: string;

  @Property({ type: 'string', nullable: false, length: 150 })
  address: string;

  @Property({ type: 'string', nullable: false, length: 5 })
  postcode: string;

  @Property({ type: 'string', nullable: false, length: 64 })
  city: string;

  @Property({ type: 'string', nullable: false, length: 9, unique: true })
  siren: string;

  @Property({ type: 'string', nullable: true, length: 14 })
  siret: string;

  @Property({ type: 'string', nullable: true, length: 64 })
  contact: string;

  @Property({ type: 'boolean', nullable: false })
  isActive: boolean;

  @Property({ type: 'string', nullable: true, default: 'pictureStore' })
  pictureUrl: string;

  @ManyToMany({ entity: () => Product, pivotEntity: () => ProductSupplier })
  products = new Collection<Product>(this);
}
