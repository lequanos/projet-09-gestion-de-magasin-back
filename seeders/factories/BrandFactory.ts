import { Factory, Faker } from '@mikro-orm/seeder';
import { Brand } from '../../src/entities/Brand.entity';

export class BrandFactory extends Factory<Brand> {
  model = Brand;

  definition(faker: Faker): Partial<Brand> {
    return {
      name: faker.company.name(),
    };
  }
}
