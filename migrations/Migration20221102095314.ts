import { Migration } from '@mikro-orm/migrations';

export class Migration20221102095314 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "aisle" drop constraint "aisle_store_id_foreign";');

    this.addSql('alter table "aisle" add constraint "aisle_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "aisle" drop constraint "aisle_store_id_foreign";');

    this.addSql('alter table "aisle" add constraint "aisle_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade;');
  }

}
