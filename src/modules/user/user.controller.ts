import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { User } from '../../entities';
import { CreateUserDto, UpdateUserDto, UserIdParamDto } from './user.dto';
import { UserService } from './user.service';

/**
 * Controller for the users
 */
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get all users
   */
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAll();
  }

  /**
   * Get one user by id
   */
  @Get(':id')
  async getOneUserById(@Param() param: UserIdParamDto): Promise<User> {
    return await this.userService.getOneById(param.id);
  }

  /**
   * Create one user
   * @param createUserDto the user's input
   * @returns the created user
   */
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto);
  }

  /**
   * Update partially one user
   * @param updateUserDto the user's input
   * @returns the updated user
   */
  @Patch()
  async updatePartialUser(@Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userService.updateUser(updateUserDto);
  }

  /**
   * Update one user
   * @param updateUserDto the user's input
   * @returns the updated user
   */
  @Put()
  async updateUser(@Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userService.updateUser(updateUserDto);
  }

  /**
   * Deactivate one user
   */
  @Delete(':id')
  async deactivateUser(@Param() param: UserIdParamDto): Promise<User> {
    return await this.userService.deactivateUser(param.id);
  }

  /**
   * Reactivate one user
   */
  @Patch(':id')
  async reactivateUser(@Param() param: UserIdParamDto): Promise<User> {
    return await this.userService.reactivateUser(param.id);
  }

  /**
   * Delete one user
   */
  @HttpCode(204)
  @Delete('/delete/:id')
  async deleteUser(@Param() param: UserIdParamDto): Promise<void> {
    await this.userService.deleteUser(param.id);
  }
}
