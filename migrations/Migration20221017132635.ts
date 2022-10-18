import { Migration } from '@mikro-orm/migrations';

export class Migration20221017132635 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product" drop constraint "product_brand_id_foreign";');

    this.addSql('alter table "product" alter column "brand_id" type int using ("brand_id"::int);');
    this.addSql('alter table "product" alter column "brand_id" set not null;');
    this.addSql('alter table "product" add constraint "product_brand_id_foreign" foreign key ("brand_id") references "brand" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" drop constraint "product_brand_id_foreign";');

    this.addSql('alter table "product" alter column "brand_id" type int using ("brand_id"::int);');
    this.addSql('alter table "product" alter column "brand_id" drop not null;');
    this.addSql('alter table "product" add constraint "product_brand_id_foreign" foreign key ("brand_id") references "brand" ("id") on update cascade on delete set null;');
  }

}
