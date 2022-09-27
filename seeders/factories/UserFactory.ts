import { Factory, Faker } from '@mikro-orm/seeder';
import { User } from '../../src/entities/User.entity';

export class UserFactory extends Factory<User> {
  model = User;

  definition(faker: Faker): Partial<User> {
    return {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.exampleEmail(),
      password: faker.internet.password(),
      isActive: faker.datatype.boolean(),
      pictureUrl: faker.internet.avatar(),
    };
  }
}
