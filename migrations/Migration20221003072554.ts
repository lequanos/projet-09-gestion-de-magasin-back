import { Migration } from '@mikro-orm/migrations';

export class Migration20221003072554 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "store" alter column "siret" type varchar(14) using ("siret"::varchar(14));',
    );
    this.addSql('alter table "store" alter column "siret" set not null;');
    this.addSql(
      'alter table "store" add constraint "store_siret_unique" unique ("siret");',
    );

    this.addSql(
      'alter table "supplier" add constraint "supplier_siren_unique" unique ("siren");',
    );

    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "store" alter column "siret" type varchar(14) using ("siret"::varchar(14));',
    );
    this.addSql('alter table "store" alter column "siret" drop not null;');
    this.addSql('alter table "store" drop constraint "store_siret_unique";');

    this.addSql(
      'alter table "supplier" drop constraint "supplier_siren_unique";',
    );

    this.addSql('alter table "user" drop constraint "user_email_unique";');
  }
}
