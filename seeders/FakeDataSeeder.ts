import type { EntityManager } from '@mikro-orm/core';
import { Seeder, faker } from '@mikro-orm/seeder';
import {
  AisleFactory,
  BrandFactory,
  CategoryFactory,
  ProductFactory,
  RoleFactory,
  StoreFactory,
  SupplierFactory,
  UserFactory,
  ProductSupplierFactory,
  StockFactory,
} from './factories';

export class FakeDataSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    let storeIndex = 0;

    const categories = new CategoryFactory(em).make(5);

    const aisles = new AisleFactory(em)
      .each((aisle) => {
        aisle.categories.set(faker.helpers.arrayElements(categories));
      })
      .make(5);

    const users = new UserFactory(em)
      .each((user) => {
        user.role = new RoleFactory(em).makeOne();
        user.aisles.set(faker.helpers.arrayElements(aisles));
      })
      .make(6);

    const brands = new BrandFactory(em).make(10);

    const suppliers = new SupplierFactory(em).make(10);

    const products = new ProductFactory(em)
      .each((product) => {
        product.brand = faker.helpers.arrayElement(brands);
      })
      .make(40);

    new ProductSupplierFactory(em)
      .each((ps) => {
        ps.product = faker.helpers.arrayElement(products);
        ps.supplier = faker.helpers.arrayElement(suppliers);
        ps.purchasePrice = Number(faker.commerce.price(1, 1000, 2));
      })
      .make(60);

    new StockFactory(em)
      .each((stock) => {
        stock.product = faker.helpers.arrayElement(products);
        stock.quantity = faker.datatype.number({ min: -30, max: 30 });
      })
      .make(200);

    const stores = new StoreFactory(em)
      .each((store) => {
        store.users.set([
          users[storeIndex * 2],
          users[storeIndex * 2 + 1],
          users[storeIndex * 2 + 2],
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

    await em.flush();
  }
}
