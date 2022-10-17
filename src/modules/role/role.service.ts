import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { EntityField, EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Role, User } from '../../entities';
import { isNotFoundError } from '../../utils/typeguards/ExceptionTypeGuards';

import { getFieldsFromQuery } from 'src/utils/helpers/getFieldsFromQuery';

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
}
