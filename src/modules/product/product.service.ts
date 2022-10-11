import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository, wrap } from '@mikro-orm/core';

import { Product, User } from '../../entities';
import { isNotFoundError } from '../../utils/typeguards/ExceptionTypeGuards';

/**
 * Service for the products
 */
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,
    private readonly logger: Logger = new Logger('ProductService'),
    private readonly em: EntityManager,
  ) {}

  /**
   * Get all users that are active
   */
  async getAll(user: Partial<User>): Promise<Product[]> {
    try {
      return await this.productRepository.find(
        { isActive: true },
        {
          fields: [
            'name',
            'code',
            'price',
            'pictureUrl',
            'nutriScore',
            'ecoScore',
            'unitPackaging',
            'ingredients',
            'brand',
            {
              brand: ['name'],
            },
          ],
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
   * Get one user by id
   * @param id the searched user's identifier
   * @returns the found user
   */
  async getOneById(id: number, user: Partial<User>): Promise<Product> {
    try {
      return await this.productRepository.findOneOrFail(
        { id, isActive: true },
        {
          fields: [
            'name',
            'code',
            'price',
            'pictureUrl',
            'nutriScore',
            'ecoScore',
            'unitPackaging',
            'ingredients',
            'brand',
            {
              brand: ['name'],
            },
          ],
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
   * Create a user from a user input
   * @param userDto the user's input
   * @returns the created user
   */
  async createUser(userDto: CreateUserDto): Promise<Product> {
    try {
      const foundUser = await this.productRepository.findOne({
        email: userDto.email,
      });

      if (foundUser)
        throw new ConflictException(
          `Email already exists${
            foundUser.isActive ? '' : ' but is deactivated'
          }`,
        );

      userDto.password = await bcrypt.hash(userDto.password, 10);

      const userCreated = this.productRepository.create(userDto);
      await this.productRepository.persistAndFlush(userCreated);
      this.em.clear();
      return await this.getOneById(userCreated.id, userCreated);
    } catch (e) {
      this.logger.error(`${e.message} `, e);
      throw e;
    }
  }

  /**
   * Update a user from a user input
   * @param userDto the user's input
   * @returns the updated user
   */
  async updateUser(userDto: UpdateUserDto, user: Partial<User>): Promise<Product> {
    try {
      const foundUser = await this.productRepository.findOneOrFail(userDto.id, {
        filters: { fromStore: { user } },
      });

      if (!foundUser?.isActive)
        throw new ConflictException('User is deactivated');

      wrap(foundUser).assign({
        ...userDto,
      });

      await this.productRepository.persistAndFlush(foundUser);
      this.em.clear();
      return await this.getOneById(foundUser.id, foundUser);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Deactivate one user
   * @param userId the identifier of the user to soft delete
   * @returns the deactivated user
   */
  async deactivateUser(userId: number, user: Partial<User>): Promise<Product> {
    try {
      const foundUser = await this.productRepository.findOneOrFail(userId, {
        filters: { fromStore: { user } },
      });

      if (!foundUser?.isActive)
        throw new ConflictException('User is already deactivated');

      foundUser.isActive = false;
      await this.productRepository.persistAndFlush(foundUser);
      this.em.clear();
      return await this.getOneById(foundUser.id, foundUser);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Reactivate one user
   * @param userId the identifier of the user to reactivate
   * @returns the reactivated user
   */
  async reactivateUser(userId: number, user: Partial<User>): Promise<Product> {
    try {
      const foundUser = await this.productRepository.findOneOrFail(userId, {
        filters: { fromStore: { user } },
      });

      if (foundUser?.isActive)
        throw new ConflictException('User is already activated');

      foundUser.isActive = true;

      await this.productRepository.persistAndFlush(foundUser);
      this.em.clear();
      return await this.getOneById(foundUser.id, foundUser);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Delete one user
   * @param userId the identifier of the user to delete
   */
  async deleteUser(userId: number, user: Partial<User>): Promise<void> {
    try {
      const foundUser = await this.productRepository.findOneOrFail(userId, {
        filters: { fromStore: { user } },
      });
      await this.productRepository.removeAndFlush(foundUser);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }
}
