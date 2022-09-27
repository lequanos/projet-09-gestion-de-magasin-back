import { Factory, Faker } from '@mikro-orm/seeder';
import { Stock } from '../../src/entities/Stock.entity';

export class StockFactory extends Factory<Stock> {
  model = Stock;

  definition(faker: Faker): Partial<Stock> {
    return {
      quantity: faker.datatype.number(1000),
    };
  }
}
