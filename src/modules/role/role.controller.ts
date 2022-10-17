import {
  Controller,
  Get,
  Param,
  Req,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';

import { Request } from 'express';

import { Role, User } from '../../entities';
import { RoleService } from './role.service';
import { RoleIdParamDto } from './role.dto';
import { Roles } from 'src/utils/decorators/roles.decorator';

/**
 * Controller for the roles
 */
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * Get all roles
   */
  @Get()
  @Roles(
    'super admin',
    'store manager',
    'purchasing manager',
    'department manager',
  )
  async getAllRoles(
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
  ): Promise<Role[]> {
    return await this.roleService.getAll(req.user as User, select, nested);
  }

  /**
   * Get one role by id
   */
  @Get(':id')
  @Roles(
    'super admin',
    'store manager',
    'purchasing manager',
    'department manager',
  )
  async getOneRoleById(
    @Req() req: Request,
    @Param() param: RoleIdParamDto,
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
  ): Promise<Role> {
    return await this.roleService.getOneById(
      param.id,
      req.user as User,
      select,
      nested,
    );
  }
}
