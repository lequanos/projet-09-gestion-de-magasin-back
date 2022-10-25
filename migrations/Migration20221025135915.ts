import { Migration } from '@mikro-orm/migrations';

export class Migration20221025135915 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product" drop constraint if exists "product_nutri_score_check";');
    this.addSql('alter table "product" drop constraint if exists "product_eco_score_check";');

    this.addSql('alter table "product" alter column "nutri_score" type text using ("nutri_score"::text);');
    this.addSql('alter table "product" add constraint "product_nutri_score_check" check ("nutri_score" in (\'A\', \'B\', \'C\', \'D\', \'E\', \'NOT-APPLICABLE\'));');
    this.addSql('alter table "product" alter column "eco_score" type text using ("eco_score"::text);');
    this.addSql('alter table "product" add constraint "product_eco_score_check" check ("eco_score" in (\'A\', \'B\', \'C\', \'D\', \'E\', \'NOT-APPLICABLE\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product" drop constraint if exists "product_nutri_score_check";');
    this.addSql('alter table "product" drop constraint if exists "product_eco_score_check";');

    this.addSql('alter table "product" alter column "nutri_score" type text using ("nutri_score"::text);');
    this.addSql('alter table "product" add constraint "product_nutri_score_check" check ("nutri_score" in (\'A\', \'B\', \'C\', \'D\', \'E\', \'Non Applicable\'));');
    this.addSql('alter table "product" alter column "eco_score" type text using ("eco_score"::text);');
    this.addSql('alter table "product" add constraint "product_eco_score_check" check ("eco_score" in (\'A\', \'B\', \'C\', \'D\', \'E\', \'Non Applicable\'));');
  }

}
