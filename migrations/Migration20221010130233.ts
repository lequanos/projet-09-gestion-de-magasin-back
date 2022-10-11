import { Migration } from '@mikro-orm/migrations';

export class Migration20221010130233 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "supplier" add column "store_id" int not null;');
    this.addSql(
      'alter table "supplier" drop constraint "supplier_siren_unique";',
    );
    this.addSql(
      'alter table "supplier" add constraint "supplier_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "supplier" drop constraint "supplier_store_id_foreign";',
    );

    this.addSql('alter table "supplier" drop column "store_id";');
    this.addSql(
      'alter table "supplier" add constraint "supplier_siren_unique" unique ("siren");',
    );
  }
}
