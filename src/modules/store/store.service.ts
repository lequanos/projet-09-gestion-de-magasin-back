import { EntityRepository, NotFoundError } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Store } from '../../entities';
import { isNotFoundError } from '../../typeguards/ExceptionTypeGuards';

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
   * Get all Stores
   */
  async getAll(): Promise<Store[]> {
    try {
      return await this.storeRepository.findAll();
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }

      throw e;
    }
  }

  /**
   * Get one store by siren
   */
  async getOneBySiren(siren: string): Promise<Store> {
    try {
      return await this.storeRepository.findOneOrFail({ siren });
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }

      throw e;
    }
  }
}
