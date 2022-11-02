import { Migration } from '@mikro-orm/migrations';

export class Migration20221102095802 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product" drop constraint "product_store_id_foreign";');

    this.addSql('alter table "supplier" drop constraint "supplier_store_id_foreign";');

    this.addSql('alter table "user" drop constraint "user_store_id_foreign";');

    this.addSql('alter table "product" add constraint "product_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "supplier" add constraint "supplier_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user" add constraint "user_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" drop constraint "product_store_id_foreign";');

    this.addSql('alter table "supplier" drop constraint "supplier_store_id_foreign";');

    this.addSql('alter table "user" drop constraint "user_store_id_foreign";');

    this.addSql('alter table "product" add constraint "product_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade;');

    this.addSql('alter table "supplier" add constraint "supplier_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade;');

    this.addSql('alter table "user" add constraint "user_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade on delete set null;');
  }

}
