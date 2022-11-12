import { Migration } from '@mikro-orm/migrations';

export class Migration20221112134451 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "role" add column "permissions" text[] not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "role" drop column "permissions";');
  }

}
