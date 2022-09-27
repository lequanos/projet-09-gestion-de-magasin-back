import { PrimaryKey, Property } from '@mikro-orm/core';

export class CustomBaseEntity {
  @PrimaryKey()
  id!: number;

  @Property({ defaultRaw: 'now()' })
  createdAt: Date;

  @Property({ defaultRaw: 'now()', onUpdate: () => new Date() })
  updatedAt: Date;
}
