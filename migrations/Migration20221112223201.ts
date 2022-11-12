import { Migration } from '@mikro-orm/migrations';

export class Migration20221112223201 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
    CREATE OR REPLACE FUNCTION same_store_constraint(roleId INTEGER, storeId INTEGER) RETURNS BOOLEAN AS
    $$
      SELECT (
        CASE
          WHEN (SELECT store_id FROM role WHERE role.id = roleId) = storeId THEN TRUE
          WHEN (SELECT store_id FROM role WHERE role.id = roleId) <> storeId THEN FALSE
          WHEN storeId IS NULL THEN TRUE
        END
        );
    $$
    LANGUAGE sql STABLE STRICT;`);

    this.addSql(
      `ALTER TABLE "user" ADD CONSTRAINT same_store_role_constraint CHECK (same_store_constraint(role_id, store_id));`,
    );
  }

  async down(): Promise<void> {
    this.addSql(
      `ALTER TABLE "user" DROP CONSTRAINT same_store_role_constraint;`,
    );
    this.addSql(`DROP FUNCTION same_store_constraint`);
  }
}
