import { Migration } from '@mikro-orm/migrations';

export class Migration20221010135219 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "product" add column "store_id" int not null;');
    this.addSql(
      'alter table "product" add constraint "product_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "product" drop constraint "product_store_id_foreign";',
    );

    this.addSql('alter table "product" drop column "store_id";');
  }
}
