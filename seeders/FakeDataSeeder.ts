import type { EntityManager } from '@mikro-orm/core';
import { Seeder, faker } from '@mikro-orm/seeder';

import * as bcrypt from 'bcrypt';

import {
  AisleFactory,
  BrandFactory,
  CategoryFactory,
  ProductFactory,
  StoreFactory,
  SupplierFactory,
  UserFactory,
  ProductSupplierFactory,
  StockFactory,
  RoleFactory,
} from './factories';
import { Aisle, User } from '../src/entities';

export class FakeDataSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    let storeIndex = 0;
    let psIndex = 0;
    let aisleIndex = 0;
    let userIndex = 0;

    const aisleNames = [
      'Liquide',
      'Vin',
      'Epicerie Sucrée',
      'Epicerie Salée',
      'Hygiène',
      'Textile',
      'Produits frais',
    ];
    const aisles = new AisleFactory(em)
      .each((aisle) => {
        aisle.name = aisleNames[aisleIndex];
        aisleIndex++;
      })
      .make(7);

    const allAisle = new AisleFactory(em).makeOne({
      name: 'tous',
    });

    aisles.push(allAisle);

    const categoryDictionary: { [key: string]: Aisle | undefined } = {
      Yaourt: aisles.find((aisle) => aisle.name === 'Produits frais'),
      Surgelés: aisles.find((aisle) => aisle.name === 'Produits frais'),
      Soda: aisles.find((aisle) => aisle.name === 'Liquide'),
      Eaux: aisles.find((aisle) => aisle.name === 'Liquide'),
      'Vin Rouge': aisles.find((aisle) => aisle.name === 'Vin'),
      'Vin Blanc': aisles.find((aisle) => aisle.name === 'Vin'),
      'Vin Rosé': aisles.find((aisle) => aisle.name === 'Vin'),
      'Papier Toilette': aisles.find((aisle) => aisle.name === 'Hygiène'),
      'Liquide vaisselle': aisles.find((aisle) => aisle.name === 'Hygiène'),
      Mouchoir: aisles.find((aisle) => aisle.name === 'Hygiène'),
      'Petit déjeuner': aisles.find(
        (aisle) => aisle.name === 'Epicerie Sucrée',
      ),
      confiserie: aisles.find((aisle) => aisle.name === 'Epicerie Sucrée'),
      Chocolat: aisles.find((aisle) => aisle.name === 'Epicerie Sucrée'),
      Gateaux: aisles.find((aisle) => aisle.name === 'Epicerie Sucrée'),
      Pâtes: aisles.find((aisle) => aisle.name === 'Epicerie Salée'),
      Riz: aisles.find((aisle) => aisle.name === 'Epicerie Salée'),
      Sauce: aisles.find((aisle) => aisle.name === 'Epicerie Salée'),
      'Vêtement enfants': aisles.find((aisle) => aisle.name === 'Textile'),
      'Vêtement femme': aisles.find((aisle) => aisle.name === 'Textile'),
      'Vêtement homme': aisles.find((aisle) => aisle.name === 'Textile'),
      Chaussures: aisles.find((aisle) => aisle.name === 'Textile'),
    };

    const categories = new CategoryFactory(em)
      .each((category) => {
        category.aisle = categoryDictionary[category.name] || allAisle;
      })
      .make(20);

    const departmentManagerRole = new RoleFactory(em).makeOne({
      id: 1,
      name: 'department manager',
    });

    const purchasingManagerRole = new RoleFactory(em).makeOne({
      id: 2,
      name: 'purchasing manager',
    });
    const storeManagerRole = new RoleFactory(em).makeOne({
      id: 3,
      name: 'store manager',
    });
    const superAdminRole = new RoleFactory(em).makeOne({
      id: 4,
      name: 'super admin',
    });

    new UserFactory(em).makeOne({
      email: 'superadmin@retailstore.com',
      password: await bcrypt.hash('superAdmin', 10),
      isActive: true,
      role: superAdminRole,
      aisles: allAisle,
    });

    const storeManagerUser1 = new UserFactory(em).makeOne({
      email: 'storeManager@retailstore.com',
      password: await bcrypt.hash('storeManager', 10),
      isActive: true,
      role: storeManagerRole,
      aisles: allAisle,
    });

    const storeManagerUser2 = new UserFactory(em).makeOne({
      email: 'storeManager@retailstore2.com',
      password: await bcrypt.hash('storeManager', 10),
      isActive: true,
      role: storeManagerRole,
      aisles: allAisle,
    });

    const purchasingManagerUser1 = new UserFactory(em).makeOne({
      email: 'purchasingManager@retailstore.com',
      password: await bcrypt.hash('purchasingManager', 10),
      isActive: true,
      role: purchasingManagerRole,
      aisles: allAisle,
    });

    const purchasingManagerUser2 = new UserFactory(em).makeOne({
      email: 'purchasingManager@retailstore2.com',
      password: await bcrypt.hash('purchasingManager', 10),
      isActive: true,
      role: purchasingManagerRole,
      aisles: allAisle,
    });

    const users = new UserFactory(em)
      .each((user) => {
        user.role = departmentManagerRole;
        user.aisles.set(
          faker.helpers.arrayElements(
            aisles.filter((aisle) => aisle.name != 'tous'),
          ),
        );
        user.email = `departmentManager${
          userIndex > 0 ? userIndex : ''
        }@retailstore.com`;
        userIndex++;
      })
      .make(6, {
        password: await bcrypt.hash('departmentManager', 10),
      });

    const brands = new BrandFactory(em).make(10);

    const suppliers = new SupplierFactory(em).make(10);

    const products = new ProductFactory(em)
      .each((product) => {
        product.brand = faker.helpers.arrayElement(brands);
      })
      .make(40);

    new ProductSupplierFactory(em)
      .each((ps) => {
        ps.product = products[psIndex % products.length];
        ps.supplier = suppliers[psIndex % suppliers.length];
        ps.purchasePrice = Number(faker.commerce.price(1, 1000, 2));
        psIndex++;
      })
      .make(40);

    new StockFactory(em)
      .each((stock) => {
        stock.product = faker.helpers.arrayElement(products);
        stock.quantity = faker.datatype.number({ min: -30, max: 30 });
      })
      .make(200);

    const stores = new StoreFactory(em)
      .each((store) => {
        const managers: User[] = [];

        if (storeIndex === 0) {
          managers.push(storeManagerUser1);
          managers.push(purchasingManagerUser1);
        } else {
          managers.push(storeManagerUser2);
          managers.push(purchasingManagerUser2);
        }

        store.users.set([
          users[storeIndex * 2],
          users[storeIndex * 2 + 1],
          users[storeIndex * 2 + 2],
          ...managers,
        ]);

        storeIndex = storeIndex === 1 ? 0 : storeIndex + 1;
      })
      .make(2);

    aisles.forEach((aisle) => {
      aisle.store = faker.helpers.arrayElement(stores);
    });

    users.forEach((user) => {
      user.store = faker.helpers.arrayElement(stores);
    });

    storeManagerUser1.store = stores[0];
    storeManagerUser2.store = stores[1];
    purchasingManagerUser1.store = stores[0];
    purchasingManagerUser2.store = stores[1];

    suppliers.forEach((supplier) => {
      supplier.store = faker.helpers.arrayElement(stores);
    });

    products.forEach((product) => {
      product.store = faker.helpers.arrayElement(stores);
      const firstCategory = faker.helpers.arrayElement(categories);
      product.categories.add(firstCategory);
    });

    await em.flush();
  }
}
