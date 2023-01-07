import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import {
  EntityField,
  EntityManager,
  EntityRepository,
  QueryOrder,
  wrap,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Aisle, User } from '../../entities';
import { isNotFoundError } from '../../utils/typeguards/ExceptionTypeGuards';

import { AisleDto, UpdateAisleDto } from './aisle.dto';
import { getFieldsFromQuery } from '../../utils/helpers/getFieldsFromQuery';

/**
 * Service for the aisles
 */
@Injectable()
export class AisleService {
  constructor(
    @InjectRepository(Aisle)
    private readonly aisleRepository: EntityRepository<Aisle>,
    private readonly logger: Logger = new Logger('AisleService'),
    private readonly em: EntityManager,
  ) {}

  /**
   * Get all aisles that are active
   */
  async getAll(
    user: Partial<User>,
    selectParams: string[] = [],
    nestedParams: string[] = [],
  ): Promise<Aisle[]> {
    try {
      const fields = getFieldsFromQuery(
        selectParams,
        nestedParams,
        this.em,
        'aisle',
      );

      return await this.aisleRepository.find(
        {},
        {
          fields: fields.length
            ? (fields as EntityField<Aisle, never>[])
            : undefined,
          orderBy: { id: QueryOrder.ASC },
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
   * Get one aisle by id
   * @param id the searched aisle's identifier
   * @returns the found aisle
   */
  async getOneById(
    id: number,
    user: Partial<User>,
    selectParams: string[] = [],
    nestedParams: string[] = [],
  ): Promise<Aisle> {
    try {
      const fields = getFieldsFromQuery(
        selectParams,
        nestedParams,
        this.em,
        'aisle',
      );
      return await this.aisleRepository.findOneOrFail(
        { id },
        {
          fields: fields.length
            ? (fields as EntityField<Aisle, never>[])
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
   * Create a aisle from a user input
   * @param aisleDto the user's input
   * @returns the created aisle
   */
  async createAisle(aisleDto: AisleDto, user: Partial<User>): Promise<Aisle> {
    try {
      const foundAisle = await this.aisleRepository.findOne(
        {
          name: aisleDto.name,
        },
        { filters: { fromStore: { user } } },
      );

      if (foundAisle)
        throw new ConflictException(
          `Aisle already exists with name : ${aisleDto.name}`,
        );
      const aisle = this.aisleRepository.create(aisleDto);
      await this.aisleRepository.persistAndFlush(aisle);
      this.em.clear();
      return await this.getOneById(aisle.id, user);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      throw e;
    }
  }

  /**
   * Update a aisle from a user input
   * @param aisleDto the user's input
   * @returns the updated aisle
   */
  async updateAisle(
    aisleDto: UpdateAisleDto,
    user: Partial<User>,
  ): Promise<Aisle> {
    try {
      const aisleToUpdate = await this.aisleRepository.findOneOrFail(
        aisleDto.id,
        {
          filters: { fromStore: { user } },
        },
      );

      const foundAisle = await this.aisleRepository.findOne(
        {
          name: aisleDto.name,
        },
        {
          filters: { fromStore: { user } },
        },
      );

      if (foundAisle) {
        throw new ConflictException(`${aisleDto.name} existe deja`);
      }

      wrap(aisleToUpdate).assign({
        ...aisleDto,
      });
      await this.aisleRepository.persistAndFlush(aisleToUpdate);
      this.em.clear();
      return await this.getOneById(aisleToUpdate.id, user);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException('Aisle not found');
      }

      throw e;
    }
  }

  /**
   * Delete one aisle
   * @param aisleId the identifier of the aisle to delete
   */
  async deleteAisle(aisleId: number, user: Partial<User>): Promise<void> {
    try {
      const foundAisle = await this.aisleRepository.findOneOrFail(aisleId, {
        filters: { fromStore: { user } },
      });
      await this.aisleRepository.removeAndFlush(foundAisle);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }
}
