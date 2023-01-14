import { EntityRepository } from '@mikro-orm/postgresql';
import { Permission, Product, ProductStats, User } from '../../entities';

export class CustomProductRepository extends EntityRepository<Product> {
  public async getStats(user: Partial<User>) {
    const connection = this.em.getConnection();
    const result = await connection.execute<any[]>(`
        SELECT 
          (SELECT COUNT(*) FROM product WHERE is_active = true ${
            !user.role?.permissions.includes(Permission.READ_ALL)
              ? 'AND store_id = ' + user.store?.id
              : ''
          } )::INT AS active_products_count,
          (SELECT COUNT(*) FROM product ${
            !user.role?.permissions.includes(Permission.READ_ALL)
              ? 'WHERE store_id = ' + user.store?.id
              : ''
          } )::INT AS products_count,
          (
            COALESCE((
              (SELECT COUNT(*) FROM product WHERE is_active = true ${
                !user.role?.permissions.includes(Permission.READ_ALL)
                  ? 'AND store_id = ' + user.store?.id
                  : ''
              }) - (SELECT COUNT(*) FROM product WHERE is_active = true AND product.created_at <= NOW() - INTERVAL '7 DAYS' ${
      !user.role?.permissions.includes(Permission.READ_ALL)
        ? 'AND store_id = ' + user.store?.id
        : ''
    })
            )::FLOAT * 100
            / NULLIF((SELECT COUNT(*) FROM product WHERE is_active = true AND product.created_at <= NOW() - INTERVAL '7 DAYS' ${
              !user.role?.permissions.includes(Permission.READ_ALL)
                ? 'AND store_id = ' + user.store?.id
                : ''
            }), 0), 0)
          ) as progression 
        `);

    return {
      activeProductsCount: result[0].active_products_count,
      productsCount: result[0].products_count,
      progression: result[0].progression,
    } as ProductStats;
  }
}
