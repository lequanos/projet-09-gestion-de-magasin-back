import { Factory, Faker } from '@mikro-orm/seeder';
import { Aisle } from '../../src/entities/Aisle.entity';

export class AisleFactory extends Factory<Aisle> {
  model = Aisle;

  definition(faker: Faker): Partial<Aisle> {
    return {
      name: faker.commerce.department(),
    };
  }
}
