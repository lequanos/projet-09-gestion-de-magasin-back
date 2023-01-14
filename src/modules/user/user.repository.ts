import { EntityRepository } from '@mikro-orm/postgresql';
import { Permission, User, UserStats } from '../../entities';

export class CustomUserRepository extends EntityRepository<User> {
  public async getStats(user: Partial<User>) {
    const connection = this.em.getConnection();
    const result = await connection.execute<any[]>(`
        SELECT 
          (SELECT COUNT(*) FROM "user" WHERE is_active = true ${
            !user.role?.permissions.includes(Permission.READ_ALL)
              ? 'AND store_id = ' + user.store?.id
              : ''
          } )::INT AS active_users_count,
          (SELECT COUNT(*) FROM "user" ${
            !user.role?.permissions.includes(Permission.READ_ALL)
              ? 'WHERE store_id = ' + user.store?.id
              : ''
          } )::INT AS users_count,
          (
            COALESCE((
              (SELECT COUNT(*) FROM "user" WHERE is_active = true ${
                !user.role?.permissions.includes(Permission.READ_ALL)
                  ? 'AND store_id = ' + user.store?.id
                  : ''
              }) - (SELECT COUNT(*) FROM "user" WHERE is_active = true AND "user".created_at <= NOW() - INTERVAL '7 DAYS' ${
      !user.role?.permissions.includes(Permission.READ_ALL)
        ? 'AND store_id = ' + user.store?.id
        : ''
    })
            )::FLOAT * 100
            / NULLIF((SELECT COUNT(*) FROM "user" WHERE is_active = true AND "user".created_at <= NOW() - INTERVAL '7 DAYS' ${
              !user.role?.permissions.includes(Permission.READ_ALL)
                ? 'AND store_id = ' + user.store?.id
                : ''
            }), 0), 0)
          ) as progression 
        `);

    return {
      activeUsersCount: result[0].active_users_count,
      usersCount: result[0].users_count,
      progression: result[0].progression,
    } as UserStats;
  }
}
