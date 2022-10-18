import { Migration } from '@mikro-orm/migrations';

export class Migration20221017134146 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product_supplier" drop constraint "product_supplier_pkey";');
    this.addSql('alter table "product_supplier" drop column "id";');
    this.addSql('alter table "product_supplier" add constraint "product_supplier_pkey" primary key ("product_id", "supplier_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product_supplier" add column "id" int not null;');
    this.addSql('alter table "product_supplier" drop constraint "product_supplier_pkey";');
    this.addSql('alter table "product_supplier" add constraint "product_supplier_pkey" primary key ("id", "product_id", "supplier_id");');
  }

}
