import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Store } from '../../entities';
import { isNotFoundError } from '../../typeguards/ExceptionTypeGuards';
import { StoreDto } from './store.dto';

/**
 * Service for the stores
 */
@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: EntityRepository<Store>,
    private readonly logger: Logger = new Logger('StoreService'),
  ) {}

  /**
   * Get all stores that are active
   */
  async getAll(): Promise<Store[]> {
    try {
      return await this.storeRepository.find({ isActive: true });
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
  async getOneBySiret(siret: string): Promise<Store> {
    try {
      return await this.storeRepository.findOneOrFail({
        siret,
        isActive: true,
      });
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
      await this.storeRepository.persistAndFlush(store);
      return store;
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
  async updateStore(storeDto: StoreDto): Promise<Store> {
    try {
      const foundStore = await this.storeRepository.findOneOrFail(storeDto.id);

      if (!foundStore?.isActive)
        throw new ConflictException('Store is deactivated');

      foundStore.name = storeDto.name;
      foundStore.address = storeDto.address;
      foundStore.postcode = storeDto.postcode;
      foundStore.city = storeDto.city;
      foundStore.siren = storeDto.siren;
      foundStore.siret = storeDto.siret;
      foundStore.isActive = storeDto.isActive;
      foundStore.pictureUrl = storeDto.pictureUrl;

      await this.storeRepository.persistAndFlush(foundStore);
      return foundStore;
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
      return foundStore;
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
      return foundStore;
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
