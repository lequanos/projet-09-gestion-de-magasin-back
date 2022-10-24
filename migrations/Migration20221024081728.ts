import { Migration } from '@mikro-orm/migrations';

export class Migration20221024081728 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product" alter column "name" type text using ("name"::text);');
    this.addSql('alter table "product" alter column "ingredients" type text using ("ingredients"::text);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" alter column "name" type varchar(64) using ("name"::varchar(64));');
    this.addSql('alter table "product" alter column "ingredients" type varchar(255) using ("ingredients"::varchar(255));');
  }

}
