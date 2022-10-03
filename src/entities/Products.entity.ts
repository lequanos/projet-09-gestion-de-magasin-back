import { Entity, Property, Enum, OneToMany, Collection } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';
import { Stock } from './Stock.entity';

@Entity()
export class Products extends CustomBaseEntity {
  @Property({ type: 'string', nullable: false, length: 64 })
  name: string;

  @Property({ type: 'string', nullable: false, length: 10 })
  code: string;

  @Property({ type: 'string', nullable: false, default: 0, length: 150 })
  price: string;

  @Property({ type: 'string', default: 'pictureStore' })
  pictureUrl: string;

  @Enum(() => ProductNutriscore)
  nutriScore!: ProductNutriscore;

  @Enum(() => ProductEcoscore)
  ecoScore!: ProductEcoscore;

  @Property({ type: 'string', nullable: false, length: 10 })
  unit_packaging: string;

  @Property({ type: 'number' })
  threshold: number;

  @Property({ type: 'string' })
  ingredients: string;

  @Property({ type: 'boolean', nullable: false })
  isActive: boolean;

  @OneToMany(() => Stock, (stock) => stock.id)
  stock = new Collection<Stock>(this);
}

export enum ProductNutriscore {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
}

export enum ProductEcoscore {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
}
