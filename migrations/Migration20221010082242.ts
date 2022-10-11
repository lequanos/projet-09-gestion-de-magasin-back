import { Migration } from '@mikro-orm/migrations';

export class Migration20221010082242 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_store_id_foreign";');

    this.addSql('alter table "user" alter column "store_id" type int using ("store_id"::int);');
    this.addSql('alter table "user" alter column "store_id" drop not null;');
    this.addSql('alter table "user" add constraint "user_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_store_id_foreign";');

    this.addSql('alter table "user" alter column "store_id" type int using ("store_id"::int);');
    this.addSql('alter table "user" alter column "store_id" set not null;');
    this.addSql('alter table "user" add constraint "user_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade;');
  }

}
