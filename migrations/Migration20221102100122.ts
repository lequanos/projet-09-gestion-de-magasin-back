import { Migration } from '@mikro-orm/migrations';

export class Migration20221102100122 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product_supplier" drop constraint "product_supplier_product_id_foreign";');
    this.addSql('alter table "product_supplier" drop constraint "product_supplier_supplier_id_foreign";');

    this.addSql('alter table "product_supplier" add constraint "product_supplier_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "product_supplier" add constraint "product_supplier_supplier_id_foreign" foreign key ("supplier_id") references "supplier" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product_supplier" drop constraint "product_supplier_product_id_foreign";');
    this.addSql('alter table "product_supplier" drop constraint "product_supplier_supplier_id_foreign";');

    this.addSql('alter table "product_supplier" add constraint "product_supplier_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');
    this.addSql('alter table "product_supplier" add constraint "product_supplier_supplier_id_foreign" foreign key ("supplier_id") references "supplier" ("id") on update cascade;');
  }

}
