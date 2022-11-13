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
  wrap,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Category, User } from '../../entities';
import { isNotFoundError } from '../../utils/typeguards/ExceptionTypeGuards';

import { CategoryDto, UpdateCategoryDto } from './category.dto';
import { getFieldsFromQuery } from 'src/utils/helpers/getFieldsFromQuery';

/**
 * Service for the categorys
 */
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    private readonly logger: Logger = new Logger('CategoryService'),
    private readonly em: EntityManager,
  ) {}

  /**
   * Get all categorys that are active
   */
  async getAll(
    user: Partial<User>,
    selectParams: string[] = [],
    nestedParams: string[] = [],
  ): Promise<Category[]> {
    try {
      const fields = getFieldsFromQuery(
        selectParams,
        nestedParams,
        this.em,
        'category',
      );

      return await this.categoryRepository.find(
        {},
        {
          fields: fields.length
            ? (fields as EntityField<Category, never>[])
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
   * Get one category by id
   * @param id the searched category's identifier
   * @returns the found category
   */
  async getOneById(
    id: number,
    user: Partial<User>,
    selectParams: string[] = [],
    nestedParams: string[] = [],
  ): Promise<Category> {
    try {
      const fields = getFieldsFromQuery(
        selectParams,
        nestedParams,
        this.em,
        'category',
      );
      return await this.categoryRepository.findOneOrFail(
        { id },
        {
          fields: fields.length
            ? (fields as EntityField<Category, never>[])
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
   * Create a category from a user input
   * @param categoryDto the user's input
   * @returns the created category
   */
  async createCategory(
    categoryDto: CategoryDto,
    user: Partial<User>,
  ): Promise<Category> {
    try {
      const foundCategory = await this.categoryRepository.findOne(
        {
          name: categoryDto.name,
        },
        { filters: { fromStore: { user } } },
      );

      if (foundCategory)
        throw new ConflictException(
          `Category already exists with name : ${categoryDto.name}`,
        );
      const category = this.categoryRepository.create(categoryDto);
      await this.categoryRepository.persistAndFlush(category);
      this.em.clear();
      return await this.getOneById(category.id, user);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      throw e;
    }
  }

  /**
   * Update a category from a user input
   * @param categoryDto the user's input
   * @returns the updated category
   */
  async updateCategory(
    categoryDto: UpdateCategoryDto,
    user: Partial<User>,
  ): Promise<Category> {
    try {
      const categoryToUpdate = await this.categoryRepository.findOneOrFail(
        categoryDto.id,
        {
          filters: { fromStore: { user } },
        },
      );

      const foundCategory = await this.categoryRepository.findOne(
        {
          name: categoryDto.name,
        },
        {
          filters: { fromStore: { user } },
        },
      );

      if (foundCategory) {
        throw new ConflictException(`${categoryDto.name} existe deja`);
      }

      wrap(categoryToUpdate).assign({
        ...categoryDto,
      });

      await this.categoryRepository.persistAndFlush(categoryToUpdate);
      this.em.clear();
      return await this.getOneById(categoryToUpdate.id, user);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException('Category not found');
      }

      throw e;
    }
  }

  /**
   * Delete one category
   * @param categoryId the identifier of the category to delete
   */
  async deleteCategory(categoryId: number, user: Partial<User>): Promise<void> {
    try {
      const foundCategory = await this.categoryRepository.findOneOrFail(
        categoryId,
        {
          filters: { fromStore: { user } },
        },
      );
      await this.categoryRepository.removeAndFlush(foundCategory);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }
}
