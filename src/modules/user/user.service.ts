import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { EntityManager, EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import * as bcrypt from 'bcrypt';

import { isNotFoundError } from '../../typeguards/ExceptionTypeGuards';
import { Role, User, Store } from '../../entities';
import { CreateUserDto, UpdateUserDto } from './user.dto';

/**
 * Service for the users
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
    @InjectRepository(Store)
    private readonly storeRepository: EntityRepository<Store>,
    private readonly logger: Logger = new Logger('UserService'),
    private readonly em: EntityManager,
  ) {}

  /**
   * Get all users that are active
   */
  async getAll(): Promise<User[]> {
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
          ],
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
  async getOneById(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail(
        { id, isActive: true },
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
          ],
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
   * Get one user by mail
   * @param mail the searched user's identifier
   * @returns the found user
   */
  async getOneByMail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail(
        { email, isActive: true },
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
          ],
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
      userDto.role = userDto.role || (await this.roleRepository.findAll())[0];
      userDto.store =
        userDto.store || (await this.storeRepository.findAll())[0];

      const user = this.userRepository.create(userDto);
      await this.userRepository.persistAndFlush(user);
      this.em.clear();
      return await this.getOneById(user.id);
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
  async updateUser(userDto: UpdateUserDto): Promise<User> {
    try {
      const foundUser = await this.userRepository.findOneOrFail(userDto.id);

      if (!foundUser?.isActive)
        throw new ConflictException('User is deactivated');

      wrap(foundUser).assign({
        ...userDto,
      });

      await this.userRepository.persistAndFlush(foundUser);
      this.em.clear();
      return await this.getOneById(foundUser.id);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Update refreshtoken from a user input
   * @param userDto the user's input
   * @returns the updated user
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
  async deactivateUser(userId: number): Promise<User> {
    try {
      const foundUser = await this.userRepository.findOneOrFail(userId);

      if (!foundUser?.isActive)
        throw new ConflictException('User is already deactivated');

      foundUser.isActive = false;

      await this.userRepository.persistAndFlush(foundUser);
      this.em.clear();
      return await this.getOneById(foundUser.id);
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
  async reactivateUser(userId: number): Promise<User> {
    try {
      const foundUser = await this.userRepository.findOneOrFail(userId);

      if (foundUser?.isActive)
        throw new ConflictException('User is already activated');

      foundUser.isActive = true;

      await this.userRepository.persistAndFlush(foundUser);
      this.em.clear();
      return await this.getOneById(foundUser.id);
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
  async deleteUser(userId: number): Promise<void> {
    try {
      const foundUser = await this.userRepository.findOneOrFail(userId);
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
