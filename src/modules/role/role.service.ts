import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { EntityField, EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Role, User, Store, Permission } from '../../entities';
import { isNotFoundError } from '../../utils/typeguards/ExceptionTypeGuards';

import { getFieldsFromQuery } from '../../utils/helpers/getFieldsFromQuery';
import { RoleDto } from './role.dto';

/**
 * Service for the roles
 */
@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
    private readonly logger: Logger = new Logger('RoleService'),
    private readonly em: EntityManager,
  ) {}

  /**
   * Get all roles that are active
   */
  async getAll(
    user: Partial<User>,
    selectParams: string[] = [],
    nestedParams: string[] = [],
  ): Promise<Role[]> {
    try {
      const fields = getFieldsFromQuery(
        selectParams,
        nestedParams,
        this.em,
        'role',
      );

      return await this.roleRepository.find(
        {},
        {
          fields: fields.length
            ? (fields as EntityField<Role, never>[])
            : undefined,
          filters: { fromStore: { user } },
        },
      );
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Get one role by id
   * @param id the searched role's identifier
   * @returns the found role
   */
  async getOneById(
    id: number,
    user: Partial<User>,
    selectParams: string[] = [],
    nestedParams: string[] = [],
  ): Promise<Role> {
    try {
      const fields = getFieldsFromQuery(
        selectParams,
        nestedParams,
        this.em,
        'role',
      );
      return await this.roleRepository.findOneOrFail(
        { id },
        {
          fields: fields.length
            ? (fields as EntityField<Role, never>[])
            : undefined,
          filters: { fromStore: { user } },
        },
      );
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Create base roles for a new store
   */
  async createRolesForNewStore(store: Store): Promise<void> {
    try {
      const storeManagerRole = new RoleDto();
      storeManagerRole.name = 'store manager';
      storeManagerRole.permissions = [
        Permission.READ_AISLE,
        Permission.MANAGE_AISLE,
        Permission.READ_BRAND,
        Permission.MANAGE_BRAND,
        Permission.READ_CATEGORY,
        Permission.MANAGE_CATEGORY,
        Permission.READ_ROLE,
        Permission.MANAGE_ROLE,
        Permission.READ_PRODUCT,
        Permission.MANAGE_PRODUCT,
        Permission.READ_STOCK,
        Permission.MANAGE_STOCK,
        Permission.READ_SUPPLIER,
        Permission.MANAGE_SUPPLIER,
        Permission.READ_USER,
        Permission.MANAGE_USER,
      ];
      storeManagerRole.store = store;
      const storeManager = this.roleRepository.create(storeManagerRole);

      const departmentManagerRole = new RoleDto();
      departmentManagerRole.name = 'department manager';
      departmentManagerRole.permissions = [
        Permission.READ_PRODUCT,
        Permission.MANAGE_PRODUCT,
        Permission.READ_ROLE,
        Permission.READ_SUPPLIER,
        Permission.READ_AISLE,
        Permission.READ_CATEGORY,
        Permission.READ_STOCK,
        Permission.MANAGE_STOCK,
      ];
      departmentManagerRole.store = store;
      const departmentManager = this.roleRepository.create(
        departmentManagerRole,
      );

      const purchasingManagerRole = new RoleDto();
      purchasingManagerRole.name = 'purchasing manager';
      purchasingManagerRole.permissions = [
        Permission.READ_AISLE,
        Permission.MANAGE_AISLE,
        Permission.READ_BRAND,
        Permission.MANAGE_BRAND,
        Permission.READ_CATEGORY,
        Permission.MANAGE_CATEGORY,
        Permission.READ_ROLE,
        Permission.READ_PRODUCT,
        Permission.MANAGE_PRODUCT,
        Permission.READ_STOCK,
        Permission.MANAGE_STOCK,
        Permission.READ_SUPPLIER,
        Permission.MANAGE_SUPPLIER,
      ];
      purchasingManagerRole.store = store;
      const purchasingManager = this.roleRepository.create(
        purchasingManagerRole,
      );

      await this.roleRepository.persistAndFlush([
        storeManager,
        departmentManager,
        purchasingManager,
      ]);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }
}
