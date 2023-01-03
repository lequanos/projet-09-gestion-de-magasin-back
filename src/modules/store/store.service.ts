import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import {
  EntityManager,
  EntityRepository,
  wrap,
  EntityField,
  QueryOrder,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';

import { Store, Aisle, Role, Permission, StoreStats } from '../../entities';
import { isNotFoundError } from '../../utils/typeguards/ExceptionTypeGuards';
import { CreateStoreDto, UpdateStoreDto } from './store.dto';
import { getFieldsFromQuery } from '../../utils/helpers/getFieldsFromQuery';
import { AisleDto } from '../aisle/aisle.dto';
import { RoleDto } from '../role/role.dto';
import { firstValueFrom, catchError } from 'rxjs';
import { SireneV3Response } from 'src/responseModels/sireneV3';

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
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
    private readonly httpService: HttpService,
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

      const orderBy = selectParams.includes('movement')
        ? { movement: QueryOrder.DESC }
        : { id: QueryOrder.ASC };

      return await this.storeRepository.find(
        {},
        {
          fields: fields.length
            ? (fields as EntityField<Store, never>[])
            : undefined,
          orderBy,
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
        { id },
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
        { siret },
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
  async createStore(storeDto: CreateStoreDto): Promise<Store> {
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
      const role = this.roleRepository.create(storeManagerRole);

      await Promise.all([
        this.aisleRepository.persistAndFlush(aisle),
        this.storeRepository.persistAndFlush(store),
        this.roleRepository.persistAndFlush(role),
      ]);

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
      const storeToUpdate = await this.storeRepository.findOneOrFail(
        storeDto.id,
        {
          populate: ['aisles'],
        },
      );

      const foundStore = await this.storeRepository.findOne({
        $and: [{ name: storeDto.name }, { siret: { $ne: storeDto.siret } }],
      });

      if (foundStore) {
        throw new ConflictException(`${storeDto.name} existe deja`);
      }

      if (!storeToUpdate?.isActive)
        throw new ConflictException('Store is deactivated');

      wrap(storeToUpdate).assign({
        ...storeDto,
      });

      await this.storeRepository.persistAndFlush(storeToUpdate);
      this.em.clear();
      return await this.getOneById(storeToUpdate.id);
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

  /**
   * Search for stores
   */
  async searchStores(search: string): Promise<Store> {
    try {
      const foundStore = await this.storeRepository.find({
        siret: { $ilike: `%${search}%` },
      });

      if (foundStore.length) {
        throw new ConflictException('Store already exists');
      }
      const { data } = await firstValueFrom(
        this.httpService.get<SireneV3Response>(`/${search}`).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw error;
          }),
        ),
      );

      if (data.header.statut === 404) {
        throw new NotFoundException(
          `Store with SIRET ${search} does not exist`,
        );
      }

      if (data.header.statut === 400) {
        throw new BadRequestException(`Invalid SIRET ${search}`);
      }

      const store = new Store(data);
      this.storeRepository.populate(store, true);
      return store;
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Get stats for dashboard card
   */
  async getStats(): Promise<StoreStats> {
    try {
      return (await this.em.find(StoreStats, {}))[0];
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }
}
