import {
  Controller,
  Get,
  Param,
  Req,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';

import { Request } from 'express';

import { Role, User, Permission } from '../../entities';
import { RoleService } from './role.service';
import { RoleIdParamDto } from './role.dto';
import { Permissions } from '../../utils/decorators/permissions.decorator';

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
  @Permissions(Permission.READ_ALL, Permission.READ_ROLE)
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
  @Permissions(Permission.READ_ALL, Permission.READ_ROLE)
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
