import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';

import { Request } from 'express';

import { Roles } from '../../utils/decorators/roles.decorator';
import { User } from '../../entities';
import { CreateUserDto, UpdateUserDto, UserIdParamDto } from './user.dto';
import { UserService } from './user.service';
import { StoreInterceptor } from '../../utils/interceptors/store.interceptor';

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
  @Roles('super admin', 'store manager', 'purchasing manager')
  async getAllUsers(
    @Req() req: Request,
    @Query(
      'select',
      new ParseArrayPipe({
        items: String,
        separator: ',',
        optional: true,
      }),
    )
    select: string[] = [],
    @Query(
      'nested',
      new ParseArrayPipe({
        items: String,
        separator: ',',
        optional: true,
      }),
    )
    nested: string[] = [],
  ): Promise<User[]> {
    return await this.userService.getAll(req.user as User, select, nested);
  }

  /**
   * Get the current user
   */
  @Get('/me')
  @Roles(
    'super admin',
    'store manager',
    'purchasing manager',
    'department manager',
  )
  async getMe(
    @Req() req: Request,
    @Query(
      'select',
      new ParseArrayPipe({
        items: String,
        separator: ',',
        optional: true,
      }),
    )
    select: string[] = [],
    @Query(
      'nested',
      new ParseArrayPipe({
        items: String,
        separator: ',',
        optional: true,
      }),
    )
    nested: string[] = [],
  ): Promise<User> {
    return await this.userService.getOneById(
      (req.user as User)?.id,
      req.user as User,
      select,
      nested,
    );
  }

  /**
   * Get one user by id
   */
  @Get(':id')
  @Roles('super admin', 'store manager')
  async getOneUserById(
    @Req() req: Request,
    @Param() param: UserIdParamDto,
    @Query(
      'select',
      new ParseArrayPipe({
        items: String,
        separator: ',',
        optional: true,
      }),
    )
    select: string[] = [],
    @Query(
      'nested',
      new ParseArrayPipe({
        items: String,
        separator: ',',
        optional: true,
      }),
    )
    nested: string[] = [],
  ): Promise<User> {
    return await this.userService.getOneById(
      param.id,
      req.user as User,
      select,
      nested,
    );
  }


  /**
   * Create one user
   * @param createUserDto the user's input
   * @returns the created user
   */
  @Post()
  @Roles('super admin', 'store manager')
  @UseInterceptors(StoreInterceptor)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto);
  }

  /**
   * Update partially one user
   * @param updateUserDto the user's input
   * @returns the updated user
   */
  @Patch()
  @Roles('super admin', 'store manager')
  @UseInterceptors(StoreInterceptor)
  async updatePartialUser(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(updateUserDto, req.user as User);
  }

  /**
   * Update one user
   * @param updateUserDto the user's input
   * @returns the updated user
   */
  @Put()
  @Roles('super admin', 'store manager')
  @UseInterceptors(StoreInterceptor)
  async updateUser(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(updateUserDto, req.user as User);
  }

  /**
   * Deactivate one user
   */
  @Delete(':id')
  @Roles('super admin', 'store manager')
  async deactivateUser(
    @Req() req: Request,
    @Param() param: UserIdParamDto,
  ): Promise<User> {
    return await this.userService.deactivateUser(param.id, req.user as User);
  }

  /**
   * Reactivate one user
   */
  @Patch(':id')
  @Roles('super admin', 'store manager')
  async reactivateUser(
    @Req() req: Request,
    @Param() param: UserIdParamDto,
  ): Promise<User> {
    return await this.userService.reactivateUser(param.id, req.user as User);
  }

  /**
   * Delete one user
   */
  @HttpCode(204)
  @Delete('/delete/:id')
  @Roles('super admin', 'store manager')
  async deleteUser(
    @Req() req: Request,
    @Param() param: UserIdParamDto,
  ): Promise<void> {
    await this.userService.deleteUser(param.id, req.user as User);
  }
}
