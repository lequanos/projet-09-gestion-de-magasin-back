import { Migration } from '@mikro-orm/migrations';

export class Migration20221112214735 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "role" alter column "store_id" type int using ("store_id"::int);');
    this.addSql('alter table "role" alter column "store_id" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "role" alter column "store_id" type int using ("store_id"::int);');
    this.addSql('alter table "role" alter column "store_id" set not null;');
  }

}
