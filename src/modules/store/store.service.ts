import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Store } from '../../entities';

/**
 * Service for the stores
 */
@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: EntityRepository<Store>,
  ) {}

  /**
   * Get all Stores
   */
  async getAll(): Promise<Store[]> {
    return await this.storeRepository.findAll();
  }
}
