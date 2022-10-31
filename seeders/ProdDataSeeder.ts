import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import * as bcrypt from 'bcrypt';
import { Role } from '../src/entities';

import { AisleFactory, UserFactory, RoleFactory } from './factories';

export class ProdDataSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const foundRole = await em.count(Role);

    if (!foundRole) {
      new RoleFactory(em).makeOne({
        id: 1,
        name: 'department manager',
      });

      new RoleFactory(em).makeOne({
        id: 2,
        name: 'purchasing manager',
      });

      new RoleFactory(em).makeOne({
        id: 3,
        name: 'store manager',
      });

      const superAdminRole = new RoleFactory(em).makeOne({
        id: 4,
        name: 'super admin',
      });

      const allAisle = new AisleFactory(em).makeOne({
        name: 'tous',
      });

      new UserFactory(em).makeOne({
        email: 'superrole.retailstore@gmail.com',
        password: await bcrypt.hash('superAdmin', 10),
        isActive: true,
        role: superAdminRole,
        aisles: allAisle,
      });

      await em.flush();
    }
  }
}
