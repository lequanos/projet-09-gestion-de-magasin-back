import { Migration } from '@mikro-orm/migrations';

export class Migration20221112134950 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "role" alter column "permissions" type text[] using ("permissions"::text[]);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "role" alter column "permissions" type text[] using ("permissions"::text[]);');
  }

}
