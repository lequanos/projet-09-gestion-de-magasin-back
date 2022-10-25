import { Migration } from '@mikro-orm/migrations';

export class Migration20221025091002 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
    CREATE OR REPLACE FUNCTION same_aisle_constraint(productId INTEGER, categoryId INTEGER) RETURNS BOOLEAN AS
    $$
      SELECT (
        CASE
          WHEN (SELECT category_id FROM product_categories WHERE product_id = productId AND category_id = (
              SELECT MAX(category_id) FROM product_categories WHERE product_id = productId
              )) IS NULL THEN TRUE
          WHEN (SELECT aisle_id FROM category WHERE id = (
            SELECT category_id FROM product_categories WHERE product_id = productId AND category_id = (
              SELECT MAX(category_id) FROM product_categories WHERE product_id = productId
              )
            )) = (SELECT aisle_id FROM category WHERE id = categoryId) THEN TRUE
          WHEN (SELECT aisle_id FROM category WHERE id = (
            SELECT category_id FROM product_categories WHERE product_id = productId AND category_id = (
              SELECT MAX(category_id) FROM product_categories WHERE product_id = productId
              )
            )) <> (SELECT aisle_id FROM category WHERE id = categoryId) THEN FALSE
        END
        );
    $$
    LANGUAGE sql STABLE STRICT;`);

    this.addSql(
      `ALTER TABLE product_categories ADD CONSTRAINT same_aisle_categories_constraint CHECK (same_aisle_constraint(product_id, category_id));`,
    );
  }

  async down(): Promise<void> {
    this.addSql(
      `ALTER TABLE product_categories DROP CONSTRAINT same_aisle_categories_constraint;`,
    );
    this.addSql(`DROP FUNCTION same_aisle_constraint`);
  }
}
