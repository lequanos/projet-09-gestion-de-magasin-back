import { HttpService } from '@nestjs/axios';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';

import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { AxiosResponse } from 'axios';
import { map, Observable, catchError } from 'rxjs';

import { Store } from '../../entities';
import {
  isNotFoundError,
  isUnauthorizedException,
} from '../../typeguards/ExceptionTypeGuards';
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
      return await this.storeRepository.findAll({
        filters: { where: { isActive: true } },
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
   * Get one store by siret
   * @param siret the searched siret number
   * @returns the found store
   */
  async getOneBySiret(siret: string): Promise<Store> {
    try {
      return await this.storeRepository.findOneOrFail({ siret });
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
      const store = this.storeRepository.create(storeDto);
      await this.storeRepository.persistAndFlush(store);
      return store;
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }
}
