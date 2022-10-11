import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { EntityManager, EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import * as bcrypt from 'bcrypt';

import { isNotFoundError } from '../../utils/typeguards/ExceptionTypeGuards';
import { User } from '../../entities';
import { CreateUserDto, UpdateUserDto } from './user.dto';

/**
 * Service for the users
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly logger: Logger = new Logger('UserService'),
    private readonly em: EntityManager,
  ) {}

  /**
   * Get all users that are active
   */
  async getAll(user: Partial<User>): Promise<User[]> {
    try {
      return await this.userRepository.find(
        { isActive: true },
        {
          fields: [
            'firstname',
            'lastname',
            'email',
            'pictureUrl',
            'role',
            {
              role: ['name'],
            },
            {
              aisles: ['name'],
            },
            'store',
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
  async getOneById(
    id: number,
    user: Partial<User>,
    isActive = true,
  ): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail(
        { id, isActive },
        {
          fields: [
            'firstname',
            'lastname',
            'email',
            'pictureUrl',
            'role',
            {
              role: ['name'],
            },
            {
              aisles: ['name'],
            },
            'store',
            {
              store: ['name'],
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
      const foundUser = await this.userRepository.findOneOrFail(userDto.id, {
        filters: { fromStore: { user } },
      });

      if (!foundUser?.isActive)
        throw new ConflictException('User is deactivated');

      wrap(foundUser).assign({
        ...userDto,
      });

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
      return await this.getOneById(foundUser.id, foundUser, false);
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
}
