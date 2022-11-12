import { Migration } from '@mikro-orm/migrations';

export class Migration20221112192525 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "role" add column "store_id" int not null;');
    this.addSql('alter table "role" add constraint "role_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "role" drop constraint "role_store_id_foreign";');

    this.addSql('alter table "role" drop column "store_id";');
  }

}
