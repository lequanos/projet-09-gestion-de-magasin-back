import {
  Entity,
  Property,
  OneToMany,
  Collection,
  Cascade,
  Formula,
} from '@mikro-orm/core';
import { CustomBaseEntity, Aisle, User, Role } from './';
@Entity()
export class Store extends CustomBaseEntity {
  @Property({ type: 'string', nullable: false, length: 64 })
  name: string;

  @Property({ type: 'string', nullable: false, length: 150 })
  address: string;

  @Property({ type: 'string', nullable: false, length: 5 })
  postcode: string;

  @Property({ type: 'string', nullable: false, length: 64 })
  city: string;

  @Property({ type: 'string', nullable: false, length: 9 })
  siren: string;

  @Property({ type: 'string', nullable: false, length: 14, unique: true })
  siret: string;

  @Property({ type: 'boolean', nullable: false })
  isActive: boolean;

  @Property({ type: 'string', nullable: true, default: 'pictureStore' })
  pictureUrl: string;

  @Formula(
    (alias) =>
      `(SELECT COUNT(*)::INT FROM stock
        JOIN product ON product.id = stock.product_id
        JOIN store ON store.id = product.store_id
        WHERE product.store_id = ${alias}.id)`,
  )
  movement?: number;

  @OneToMany(() => User, (user) => user.store, {
    orphanRemoval: true,
  })
  users = new Collection<User>(this);

  @OneToMany(() => Aisle, (aisle) => aisle.store, {
    cascade: [Cascade.ALL],
  })
  aisles = new Collection<Aisle>(this);

  @OneToMany(() => Role, (role) => role.store, {
    cascade: [Cascade.ALL],
  })
  roles = new Collection<Role>(this);
}

@Entity({
  expression: `
  SELECT
    (SELECT COUNT(*) FROM store WHERE is_active = true)::INT AS active_stores_count,
    (SELECT COUNT(*) FROM store)::INT AS stores_count,
    (
      COALESCE((
        (SELECT COUNT(*) FROM store WHERE is_active = true) - (SELECT COUNT(*) FROM store WHERE is_active = true AND store.created_at <= NOW() - INTERVAL '7 DAYS')
      )::FLOAT * 100
      / NULLIF((SELECT COUNT(*) FROM store WHERE is_active = true AND store.created_at <= NOW() - INTERVAL '7 DAYS'), 0), 0)
    ) as progression
  `,
})
export class StoreStats {
  @Property({ type: 'number', nullable: false })
  activeStoresCount: number;

  @Property({ type: 'number', nullable: false })
  storesCount: number;

  @Property({ type: 'number', nullable: false })
  progression: number;
}
