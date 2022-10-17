import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Aisle } from '../../entities';
import { isNotFoundError } from '../../utils/typeguards/ExceptionTypeGuards';

import { AisleDto, UpdateAisleDto } from './aisle.dto';

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
  async getAll(): Promise<Aisle[]> {
    try {
      return await this.aisleRepository.find(
        {},
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
   * Get one aisle by id
   * @param id the searched aisle's identifier
   * @returns the found aisle
   */
  async getOneById(id: number): Promise<Aisle> {
    try {
      return await this.aisleRepository.findOneOrFail(
        { id },
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
   * Create a aisle from a user input
   * @param aisleDto the user's input
   * @returns the created aisle
   */
  async createAisle(aisleDto: AisleDto): Promise<Aisle> {
    try {
      const foundAisle = await this.aisleRepository.findOne({
        name: aisleDto.name,
      });

      if (foundAisle)
        throw new ConflictException(
          `Aisle already exists with name : ${aisleDto.name}`,
        );
      const aisle = this.aisleRepository.create(aisleDto);
      await this.aisleRepository.persistAndFlush(aisle);
      this.em.clear();
      return await this.getOneById(aisle.id);
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
  async updateBAisle(aisleDto: UpdateAisleDto): Promise<Aisle> {
    try {
      const foundAisle = await this.aisleRepository.findOneOrFail(aisleDto.id);
      foundAisle.name = aisleDto.name;
      await this.aisleRepository.persistAndFlush(foundAisle);
      this.em.clear();
      return await this.getOneById(foundAisle.id);
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
  async deleteAisle(aisleId: number): Promise<void> {
    try {
      const foundAisle = await this.aisleRepository.findOneOrFail(aisleId);
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
