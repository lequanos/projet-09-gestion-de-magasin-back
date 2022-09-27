import { Migration } from '@mikro-orm/migrations';

export class Migration20220927074241 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "brand" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(64) not null);',
    );

    this.addSql(
      'create table "product" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(64) not null, "code" varchar(13) not null, "price" real not null default 0, "picture_url" varchar(255) null default \'pictureStore\', "nutri_score" text check ("nutri_score" in (\'A\', \'B\', \'C\', \'D\', \'E\')) not null, "eco_score" text check ("eco_score" in (\'A\', \'B\', \'C\', \'D\', \'E\')) not null, "unit_packaging" varchar(10) not null, "threshold" int not null default 0, "ingredients" varchar(255) not null, "is_active" boolean not null, "brand_id" int null);',
    );

    this.addSql(
      'create table "role" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(64) not null);',
    );

    this.addSql(
      'create table "stock" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "quantity" int not null, "product_id" int null);',
    );

    this.addSql(
      'create table "store" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(64) not null, "address" varchar(150) not null, "postcode" varchar(5) not null, "city" varchar(64) not null, "siren" varchar(9) not null, "siret" varchar(14) null, "is_active" boolean not null, "picture_url" varchar(255) null default \'pictureStore\');',
    );

    this.addSql(
      'create table "aisle" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(64) not null, "store_id" int not null);',
    );

    this.addSql(
      'create table "category" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(64) not null, "aisle_id" int null);',
    );

    this.addSql(
      'create table "product_categories" ("product_id" int not null, "category_id" int not null, constraint "product_categories_pkey" primary key ("product_id", "category_id"));',
    );

    this.addSql(
      'create table "supplier" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "name" varchar(64) not null, "phone_number" varchar(10) not null, "address" varchar(150) not null, "postcode" varchar(5) not null, "city" varchar(64) not null, "siren" varchar(9) not null, "siret" varchar(14) null, "contact" varchar(64) null, "is_active" boolean not null, "picture_url" varchar(255) null default \'pictureStore\');',
    );

    this.addSql(
      'create table "product_supplier" ("id" int not null, "product_id" int not null, "supplier_id" int not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "purchase_price" real not null, constraint "product_supplier_pkey" primary key ("id", "product_id", "supplier_id"));',
    );

    this.addSql(
      'create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "firstname" varchar(64) not null, "lastname" varchar(64) not null, "email" varchar(150) not null, "password" varchar(64) not null, "is_active" boolean not null, "picture_url" varchar(255) null default \'pictureStore\', "role_id" int not null, "store_id" int not null);',
    );

    this.addSql(
      'create table "user_aisles" ("user_id" int not null, "aisle_id" int not null, constraint "user_aisles_pkey" primary key ("user_id", "aisle_id"));',
    );

    this.addSql(
      'alter table "product" add constraint "product_brand_id_foreign" foreign key ("brand_id") references "brand" ("id") on update cascade on delete set null;',
    );

    this.addSql(
      'alter table "stock" add constraint "stock_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete set null;',
    );

    this.addSql(
      'alter table "aisle" add constraint "aisle_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "category" add constraint "category_aisle_id_foreign" foreign key ("aisle_id") references "aisle" ("id") on update cascade on delete set null;',
    );

    this.addSql(
      'alter table "product_categories" add constraint "product_categories_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "product_categories" add constraint "product_categories_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "product_supplier" add constraint "product_supplier_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "product_supplier" add constraint "product_supplier_supplier_id_foreign" foreign key ("supplier_id") references "supplier" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "user" add constraint "user_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "user" add constraint "user_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "user_aisles" add constraint "user_aisles_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "user_aisles" add constraint "user_aisles_aisle_id_foreign" foreign key ("aisle_id") references "aisle" ("id") on update cascade on delete cascade;',
    );
  }
}
