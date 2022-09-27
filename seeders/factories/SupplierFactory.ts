import { Factory, Faker } from '@mikro-orm/seeder';
import { Supplier } from '../../src/entities/Supplier.entity';

export class SupplierFactory extends Factory<Supplier> {
  model = Supplier;

  definition(faker: Faker): Partial<Supplier> {
    return {
      name: faker.company.name(),
      phoneNumber: faker.phone.number('##########'),
      address: faker.address.streetAddress(),
      postcode: faker.address.zipCode('#####'),
      city: faker.address.cityName(),
      siren: faker.address.zipCode('#########'),
      siret: faker.address.zipCode('##############'),
      contact: faker.name.fullName(),
      isActive: faker.datatype.boolean(),
      pictureUrl: faker.image.avatar(),
    };
  }
}
