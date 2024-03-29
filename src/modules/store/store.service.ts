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

import { Store, Aisle, Role, StoreStats, User } from '../../entities';
import { isNotFoundError } from '../../utils/typeguards/ExceptionTypeGuards';
import { CreateStoreDto, UpdateStoreDto } from './store.dto';
import { getFieldsFromQuery } from '../../utils/helpers/getFieldsFromQuery';
import { AisleDto } from '../aisle/aisle.dto';
import { firstValueFrom, catchError } from 'rxjs';
import { SireneV3Response } from 'src/responseModels/sireneV3';
import { RoleService } from '../role/role.service';

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
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly httpService: HttpService,
    private readonly roleService: RoleService,
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
    this.em.begin();
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

      await this.roleService.createRolesForNewStore(store);

      const allAisle = new AisleDto();
      allAisle.name = 'All';
      allAisle.store = store;
      const aisle = this.aisleRepository.create(allAisle);

      await Promise.all([
        this.aisleRepository.persistAndFlush(aisle),
        this.storeRepository.persistAndFlush(store),
      ]);
      await this.em.commit();
      this.em.clear();
      return await this.getOneById(store.id);
    } catch (e) {
      await this.em.rollback();
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
    this.em.begin();
    try {
      const foundStore = await this.storeRepository.findOneOrFail(storeId);

      if (!foundStore?.isActive)
        throw new ConflictException('Store is already deactivated');

      foundStore.isActive = false;

      const foundUsers = await this.userRepository.find({ store: foundStore });
      foundUsers.forEach((user) => (user.isActive = false));

      await this.storeRepository.persistAndFlush(foundStore);
      await this.userRepository.persistAndFlush(foundUsers);
      await this.em.commit();
      this.em.clear();
      return await this.getOneById(foundStore.id);
    } catch (e) {
      this.logger.error(`${e.message} `, e);
      await this.em.rollback();
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
  async searchStores(search: string): Promise<Store[]> {
    try {
      return await this.storeRepository.find(
        {
          $or: [
            { name: { $ilike: `%${search}%` } },
            { siret: { $ilike: `%${search}%` } },
            { siren: { $ilike: `%${search}%` } },
          ],
        },
        {
          fields: ['name'],
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
   * Search for stores on SireneV3
   */
  async searchStoresSireneV3(search: string): Promise<Store> {
    try {
      const foundStore = await this.storeRepository.findOne({
        siret: search,
      });

      if (foundStore) {
        throw new ConflictException('Store already exists');
      }
      const { data } = await firstValueFrom(
        this.httpService.get<SireneV3Response>(`/${search}`).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);

            if (
              (error.response?.data as SireneV3Response).header.statut === 404
            ) {
              throw new NotFoundException(
                `Supplier with SIRET ${search} does not exist`,
              );
            }

            if (
              (error.response?.data as SireneV3Response).header.statut === 400
            ) {
              throw new BadRequestException(`Invalid SIRET ${search}`);
            }

            throw error;
          }),
        ),
      );

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
