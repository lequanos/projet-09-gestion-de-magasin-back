import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Brand } from '../../entities';
import { isNotFoundError } from '../../typeguards/ExceptionTypeGuards';

import { BrandDto, UpdateBrandDto } from './brand.dto';

/**
 * Service for the brands
 */
@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: EntityRepository<Brand>,
    private readonly logger: Logger = new Logger('BrandService'),
    private readonly em: EntityManager,
  ) {}

  /**
   * Get all brands that are active
   */
  async getAll(): Promise<Brand[]> {
    try {
      return await this.brandRepository.find(
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
   * Get one brand by id
   * @param id the searched brand's identifier
   * @returns the found brand
   */
  async getOneById(id: number): Promise<Brand> {
    try {
      return await this.brandRepository.findOneOrFail(
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
   * Create a brand from a user input
   * @param brandDto the user's input
   * @returns the created brand
   */
  async createBrand(brandDto: BrandDto): Promise<Brand> {
    try {
      const foundBrand = await this.brandRepository.findOne({
        name: brandDto.name,
      });

      if (foundBrand)
        throw new ConflictException(
          `Brand already exists with name : ${brandDto.name}`,
        );
      const brand = this.brandRepository.create(brandDto);
      await this.brandRepository.persistAndFlush(brand);
      this.em.clear();
      return await this.getOneById(brand.id);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      throw e;
    }
  }

  /**
   * Update a brand from a user input
   * @param brandDto the user's input
   * @returns the updated brand
   */
  async updateBrand(brandDto: UpdateBrandDto): Promise<Brand> {
    try {
      const foundBrand = await this.brandRepository.findOneOrFail(brandDto.id);
      foundBrand.name = brandDto.name;
      await this.brandRepository.persistAndFlush(foundBrand);
      this.em.clear();
      return await this.getOneById(foundBrand.id);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException('Brand not found');
      }

      throw e;
    }
  }

  /**
   * Delete one brand
   * @param brandId the identifier of the brand to delete
   */
  async deleteBrand(brandId: number): Promise<void> {
    try {
      const foundBrand = await this.brandRepository.findOneOrFail(brandId);
      await this.brandRepository.removeAndFlush(foundBrand);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }
}
