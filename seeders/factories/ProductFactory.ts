import { Factory, Faker } from '@mikro-orm/seeder';
import {
  Product,
  ProductNutriscore,
  ProductEcoscore,
} from '../../src/entities/Product.entity';

export class ProductFactory extends Factory<Product> {
  model = Product;

  definition(faker: Faker): Partial<Product> {
    return {
      name: faker.commerce.productName(),
      code: faker.random.alphaNumeric(13),
      price: Number(faker.commerce.price(1, 1000, 2)),
      nutriScore: faker.helpers.arrayElement([
        ProductNutriscore.A,
        ProductNutriscore.B,
        ProductNutriscore.C,
        ProductNutriscore.D,
        ProductNutriscore.E,
      ]),
      ecoScore: faker.helpers.arrayElement([
        ProductEcoscore.A,
        ProductEcoscore.B,
        ProductEcoscore.C,
        ProductEcoscore.D,
        ProductEcoscore.E,
      ]),
      unitPackaging: faker.commerce.price(1, 1000, 0, 'g'),
      threshold: faker.datatype.number(30),
      ingredients: faker.lorem.lines(2),
      pictureUrl: faker.image.avatar(),
      isActive: faker.datatype.boolean(),
    };
  }
}
