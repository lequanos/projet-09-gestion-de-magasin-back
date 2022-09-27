import { Factory, Faker } from '@mikro-orm/seeder';
import { Category } from '../../src/entities/Category.entity';

export class CategoryFactory extends Factory<Category> {
  model = Category;

  definition(faker: Faker): Partial<Category> {
    return {
      name: faker.commerce.productAdjective(),
    };
  }
}
