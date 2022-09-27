import { Factory, Faker } from '@mikro-orm/seeder';
import { Role } from '../../src/entities/Role.entity';

export class RoleFactory extends Factory<Role> {
  model = Role;

  definition(faker: Faker): Partial<Role> {
    return {
      name: faker.name.jobTitle(),
    };
  }
}
