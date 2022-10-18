import { Migration } from '@mikro-orm/migrations';

export class Migration20221017155314 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product_supplier" alter column "purchase_price" type real using ("purchase_price"::real);');
    this.addSql('alter table "product_supplier" alter column "purchase_price" set default 0;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product_supplier" alter column "purchase_price" drop default;');
    this.addSql('alter table "product_supplier" alter column "purchase_price" type real using ("purchase_price"::real);');
  }

}
