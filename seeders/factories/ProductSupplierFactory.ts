import { Factory, Faker } from '@mikro-orm/seeder';
import { ProductSupplier } from '../../src/entities/ProductSupplier.entity';

export class ProductSupplierFactory extends Factory<ProductSupplier> {
  model = ProductSupplier;

  definition(faker: Faker): Partial<ProductSupplier> {
    return {
      purchasePrice: Number(faker.commerce.price(1, 1000, 2)),
      id: faker.helpers.unique(() => Math.floor(Math.random() * 100)),
    };
  }
}
