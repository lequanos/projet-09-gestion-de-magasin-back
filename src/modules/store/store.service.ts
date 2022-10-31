import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import {
  EntityManager,
  EntityRepository,
  wrap,
  EntityField,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Store, Aisle } from '../../entities';
import { isNotFoundError } from '../../utils/typeguards/ExceptionTypeGuards';
import { StoreDto, UpdateStoreDto } from './store.dto';
import { getFieldsFromQuery } from '../../utils/helpers/getFieldsFromQuery';
import { AisleDto } from '../aisle/aisle.dto';

/**
 * Service for the stores
 */
@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: EntityRepository<Store>,
    @InjectRepository(Aisle)
    private readonly aisleRepository: EntityRepository<Aisle>,
    private readonly logger: Logger = new Logger('StoreService'),
    private readonly em: EntityManager,
  ) {}

  /**
   * Get all stores that are active
   */
  async getAll(
    selectParams: string[] = [],
    nestedParams: string[] = [],
  ): Promise<Store[]> {
    try {
      const fields = getFieldsFromQuery(
        selectParams,
        nestedParams,
        this.em,
        'store',
      );

      return await this.storeRepository.find(
        { isActive: true },
        {
          fields: fields.length
            ? (fields as EntityField<Store, never>[])
            : undefined,
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
   * Get one store by id
   * @param id the searched store's identifier
   * @returns the found store
   */
  async getOneById(
    id: number,
    isActive = true,
    selectParams: string[] = [],
    nestedParams: string[] = [],
  ): Promise<Store> {
    try {
      const fields = getFieldsFromQuery(
        selectParams,
        nestedParams,
        this.em,
        'store',
      );

      return await this.storeRepository.findOneOrFail(
        { id, isActive },
        {
          fields: fields.length
            ? (fields as EntityField<Store, never>[])
            : undefined,
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
   * Get one store by siret
   * @param siret the searched siret number
   * @returns the found store
   */
  async getOneBySiret(
    siret: string,
    selectParams: string[] = [],
    nestedParams: string[] = [],
  ): Promise<Store> {
    try {
      const fields = getFieldsFromQuery(
        selectParams,
        nestedParams,
        this.em,
        'store',
      );

      return await this.storeRepository.findOneOrFail(
        {
          siret,
          isActive: true,
        },
        {
          fields: fields.length
            ? (fields as EntityField<Store, never>[])
            : undefined,
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
   * Create a store from a user input
   * @param storeDto the user's input
   * @returns the created store
   */
  async createStore(storeDto: StoreDto): Promise<Store> {
    try {
      const foundStore = await this.storeRepository.findOne({
        siret: storeDto.siret,
      });

      if (foundStore)
        throw new ConflictException(
          `Store already exists${
            foundStore.isActive ? '' : ' but is deactivated'
          }`,
        );

      const store = this.storeRepository.create(storeDto);

      const allAisle = new AisleDto();
      allAisle.name = 'tous';
      allAisle.store = store;
      const aisle = this.aisleRepository.create(allAisle);

      await this.aisleRepository.persistAndFlush(aisle);
      await this.storeRepository.persistAndFlush(store);

      this.em.clear();
      return await this.getOneById(store.id);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      throw e;
    }
  }

  /**
   * Update a store from a user input
   * @param storeDto the user's input
   * @returns the updated store
   */
  async updateStore(storeDto: UpdateStoreDto): Promise<Store> {
    try {
      const foundStore = await this.storeRepository.findOneOrFail(storeDto.id, {
        populate: ['aisles'],
      });

      if (!foundStore?.isActive)
        throw new ConflictException('Store is deactivated');

      wrap(foundStore).assign({
        ...storeDto,
      });

      await this.storeRepository.persistAndFlush(foundStore);
      this.em.clear();
      return await this.getOneById(foundStore.id);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Deactivate one store
   * @param storeId the identifier of the store to soft delete
   * @returns the deactivated store
   */
  async deactivateStore(storeId: number): Promise<Store> {
    try {
      const foundStore = await this.storeRepository.findOneOrFail(storeId);

      if (!foundStore?.isActive)
        throw new ConflictException('Store is already deactivated');

      foundStore.isActive = false;

      await this.storeRepository.persistAndFlush(foundStore);
      this.em.clear();
      return await this.getOneById(foundStore.id, false);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Reactivate one store
   * @param storeId the identifier of the store to reactivate
   * @returns the reactivated store
   */
  async reactivateStore(storeId: number): Promise<Store> {
    try {
      const foundStore = await this.storeRepository.findOneOrFail(storeId);

      if (foundStore?.isActive)
        throw new ConflictException('Store is already activated');

      foundStore.isActive = true;

      await this.storeRepository.persistAndFlush(foundStore);
      this.em.clear();
      return await this.getOneById(foundStore.id);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Delete one store
   * @param storeId the identifier of the store to delete
   */
  async deleteStore(storeId: number): Promise<void> {
    try {
      const foundStore = await this.storeRepository.findOneOrFail(storeId);
      await this.storeRepository.removeAndFlush(foundStore);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }
}
