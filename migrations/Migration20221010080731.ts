import { Migration } from '@mikro-orm/migrations';

export class Migration20221010080731 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "refresh_token" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "refresh_token";');
  }

}
