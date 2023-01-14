import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import {
  EntityManager,
  EntityRepository,
  wrap,
  EntityField,
  FilterQuery,
  QueryOrder,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import * as bcrypt from 'bcrypt';

import { isNotFoundError } from '../../utils/typeguards/ExceptionTypeGuards';
import { getFieldsFromQuery } from '../../utils/helpers/getFieldsFromQuery';
import { User, UserStats } from '../../entities';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { CustomUserRepository } from './user.repository';

/**
 * Service for the users
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: CustomUserRepository,
    private readonly logger: Logger = new Logger('UserService'),
    private readonly em: EntityManager,
  ) {}

  /**
   * Get all users that are active
   */
  async getAll(
    user: Partial<User>,
    selectParams: string[] = [],
    nestedParams: string[] = [],
  ): Promise<User[]> {
    try {
      const fields = getFieldsFromQuery(
        selectParams,
        nestedParams,
        this.em,
        'user',
      );

      return await this.userRepository.find(
        {},
        {
          fields: fields.length
            ? (fields as EntityField<User, never>[])
            : undefined,
          orderBy: { id: QueryOrder.ASC },
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
  async getOneById(
    id: number,
    user: Partial<User>,
    selectParams: string[] = [],
    nestedParams: string[] = [],
    isActive: boolean | undefined = undefined,
  ): Promise<User> {
    try {
      const fields = getFieldsFromQuery(
        selectParams,
        nestedParams,
        this.em,
        'user',
      );
      const filterQuery: FilterQuery<User> = { id };
      if (isActive) {
        filterQuery.isActive = isActive;
      }
      return await this.userRepository.findOneOrFail(filterQuery, {
        fields: fields.length
          ? (fields as EntityField<User, never>[])
          : undefined,
        filters: { fromStore: { user } },
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
   * Get the user from his refresh token
   * @param refreshToken
   * @returns a user
   */
  async getOneByRefreshToken(refreshToken: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail(
        { refreshToken, isActive: true },
        {
          fields: [
            'firstname',
            'lastname',
            'email',
            'pictureUrl',
            'role',
            'refreshToken',
            {
              role: ['name'],
            },
            {
              aisles: ['name'],
            },
          ],
        },
      );

      if (!user.refreshToken)
        throw new ForbiddenException('Access Denied, nonono');

      return user;
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
  async createUser(userDto: CreateUserDto): Promise<User> {
    try {
      const foundUser = await this.userRepository.findOne({
        email: userDto.email,
      });

      if (foundUser)
        throw new ConflictException(
          `Email already exists${
            foundUser.isActive ? '' : ' but is deactivated'
          }`,
        );

      userDto.password = await bcrypt.hash(userDto.password, 10);

      const userCreated = this.userRepository.create(userDto);
      await this.userRepository.persistAndFlush(userCreated);
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
  async updateUser(userDto: UpdateUserDto, user: Partial<User>): Promise<User> {
    try {
      const userToUpdate = await this.userRepository.findOneOrFail(userDto.id, {
        filters: { fromStore: { user } },
      });

      const foundUser = await this.userRepository.findOne(
        {
          $and: [{ email: userDto.email }, { id: { $ne: userDto.id } }],
        },
        {
          filters: { fromStore: { user } },
        },
      );

      if (foundUser) {
        throw new ConflictException(`${userDto.email} existe deja`);
      }

      if (!userToUpdate?.isActive)
        throw new ConflictException('User is deactivated');

      wrap(userToUpdate).assign({
        ...userDto,
      });

      await this.userRepository.persistAndFlush(userToUpdate);
      this.em.clear();
      return await this.getOneById(userToUpdate.id, userToUpdate);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Update refreshtoken after an asked refresh
   * @param userId the user's identifier
   * @param refreshToken the new refresh token
   */
  async updateUserRefreshToken(
    userId: number,
    refreshToken: string | null,
  ): Promise<void> {
    try {
      const foundUser = await this.userRepository.findOneOrFail(userId);

      if (!foundUser?.isActive)
        throw new ConflictException('User is deactivated');

      foundUser.refreshToken = refreshToken || '';

      await this.userRepository.persistAndFlush(foundUser);
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
  async deactivateUser(userId: number, user: Partial<User>): Promise<User> {
    try {
      const foundUser = await this.userRepository.findOneOrFail(userId, {
        filters: { fromStore: { user } },
      });

      if (!foundUser?.isActive)
        throw new ConflictException('User is already deactivated');

      foundUser.isActive = false;
      await this.userRepository.persistAndFlush(foundUser);
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
  async reactivateUser(userId: number, user: Partial<User>): Promise<User> {
    try {
      const foundUser = await this.userRepository.findOneOrFail(userId, {
        filters: { fromStore: { user } },
      });

      if (foundUser?.isActive)
        throw new ConflictException('User is already activated');

      foundUser.isActive = true;

      await this.userRepository.persistAndFlush(foundUser);
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
      const foundUser = await this.userRepository.findOneOrFail(userId, {
        filters: { fromStore: { user } },
      });
      await this.userRepository.removeAndFlush(foundUser);
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
  async getStats(user: Partial<User>): Promise<UserStats> {
    try {
      return await this.userRepository.getStats(user);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }
}
