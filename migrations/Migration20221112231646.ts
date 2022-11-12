import { Migration } from '@mikro-orm/migrations';

export class Migration20221112231646 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "role" alter column "permissions" type text[] using ("permissions"::text[]);');
    this.addSql('alter table "role" alter column "permissions" set default \'{}\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "role" alter column "permissions" drop default;');
    this.addSql('alter table "role" alter column "permissions" type text[] using ("permissions"::text[]);');
  }

}
