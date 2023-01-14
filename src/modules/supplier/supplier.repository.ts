import { EntityRepository } from '@mikro-orm/postgresql';
import { Permission, Supplier, SupplierStats, User } from '../../entities';

export class CustomSupplierRepository extends EntityRepository<Supplier> {
  public async getStats(user: Partial<User>) {
    const connection = this.em.getConnection();
    const result = await connection.execute<any[]>(`
        SELECT 
          (SELECT COUNT(*) FROM supplier WHERE is_active = true ${
            !user.role?.permissions.includes(Permission.READ_ALL)
              ? 'AND store_id = ' + user.store?.id
              : ''
          } )::INT AS active_suppliers_count,
          (SELECT COUNT(*) FROM supplier ${
            !user.role?.permissions.includes(Permission.READ_ALL)
              ? 'WHERE store_id = ' + user.store?.id
              : ''
          } )::INT AS suppliers_count,
          (
            COALESCE((
              (SELECT COUNT(*) FROM supplier WHERE is_active = true ${
                !user.role?.permissions.includes(Permission.READ_ALL)
                  ? 'AND store_id = ' + user.store?.id
                  : ''
              }) - (SELECT COUNT(*) FROM supplier WHERE is_active = true AND supplier.created_at <= NOW() - INTERVAL '7 DAYS' ${
      !user.role?.permissions.includes(Permission.READ_ALL)
        ? 'AND store_id = ' + user.store?.id
        : ''
    })
            )::FLOAT * 100
            / NULLIF((SELECT COUNT(*) FROM supplier WHERE is_active = true AND supplier.created_at <= NOW() - INTERVAL '7 DAYS' ${
              !user.role?.permissions.includes(Permission.READ_ALL)
                ? 'AND store_id = ' + user.store?.id
                : ''
            }), 0), 0)
          ) as progression 
        `);

    return {
      activeSuppliersCount: result[0].active_suppliers_count,
      suppliersCount: result[0].suppliers_count,
      progression: result[0].progression,
    } as SupplierStats;
  }
}
