import { Factory, Faker } from '@mikro-orm/seeder';
import { Category } from '../../src/entities/Category.entity';

export class CategoryFactory extends Factory<Category> {
  model = Category;

  definition(faker: Faker): Partial<Category> {
    return {
      name: faker.helpers.unique(() => {
        return faker.helpers.arrayElement([
          'Yaourt',
          'Surgelés',
          'Soda',
          'Eaux',
          'Vin Rouge',
          'Vin Blanc',
          'Vin Rosé',
          'Papier Toilette',
          'Liquide vaisselle',
          'Mouchoir',
          'Petit déjeuner',
          'confiserie',
          'Chocolat',
          'Gateaux',
          'Pâtes',
          'Riz',
          'Sauce',
          'Vêtement enfants',
          'Vêtement femme',
          'Vêtement homme',
          'Chaussures',
        ]);
      }),
    };
  }
}
