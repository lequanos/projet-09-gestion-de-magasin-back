import { Factory, Faker } from '@mikro-orm/seeder';
import { Store } from '../../src/entities/Store.entity';

export class StoreFactory extends Factory<Store> {
  model = Store;

  definition(faker: Faker): Partial<Store> {
    return {
      name: faker.company.name(),
      address: faker.address.streetAddress(),
      postcode: faker.address.zipCode('#####'),
      city: faker.address.cityName(),
      siren: faker.address.zipCode('#########'),
      siret: faker.address.zipCode('##############'),
      isActive: true,
      pictureUrl: faker.image.avatar(),
    };
  }
}
