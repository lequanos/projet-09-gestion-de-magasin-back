import { Migration } from '@mikro-orm/migrations';

export class Migration20221024135801 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "supplier" alter column "address" type text using ("address"::text);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "supplier" alter column "address" type varchar(150) using ("address"::varchar(150));');
  }

}
