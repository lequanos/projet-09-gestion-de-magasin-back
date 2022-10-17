import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpCode,
  Req,
  Query,
  ParseArrayPipe,
  UseInterceptors,
  Patch,
} from '@nestjs/common';

import { Request } from 'express';

import { Aisle, User } from '../../entities';
import { AisleService } from './aisle.service';
import { AisleIdParamDto, AisleDto, UpdateAisleDto } from './aisle.dto';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { StoreInterceptor } from 'src/utils/interceptors/store.interceptor';

/**
 * Controller for the aisles
 */
@Controller('aisle')
export class AisleController {
  constructor(private readonly aisleService: AisleService) {}

  /**
   * Get all aisles
   */
  @Get()
  @Roles(
    'super admin',
    'store manager',
    'purchasing manager',
    'department manager',
  )
  async getAllAisles(
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
  ): Promise<Aisle[]> {
    return await this.aisleService.getAll(req.user as User, select, nested);
  }

  /**
   * Get one aisle by id
   */
  @Get(':id')
  @Roles(
    'super admin',
    'store manager',
    'purchasing manager',
    'department manager',
  )
  async getOneAisleById(
    @Req() req: Request,
    @Param() param: AisleIdParamDto,
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
  ): Promise<Aisle> {
    return await this.aisleService.getOneById(
      param.id,
      req.user as User,
      select,
      nested,
    );
  }

  /**
   * Create one aisle
   * @param aisleDto the user's input
   * @returns the created aisle
   */
  @Post()
  @Roles('super admin', 'store manager', 'purchasing manager')
  @UseInterceptors(StoreInterceptor)
  async createAisle(
    @Req() req: Request,
    @Body() aisleDto: AisleDto,
  ): Promise<Aisle> {
    return await this.aisleService.createAisle(aisleDto, req.user as User);
  }

  /**
   * Update one Partial aisle
   * @param aisleDto the user's input
   * @returns the updated aisle
   */
  @Patch()
  @Roles('super admin', 'store manager', 'purchasing manager')
  @UseInterceptors(StoreInterceptor)
  async updatePartialAisle(
    @Req() req: Request,
    @Body() aisleDto: UpdateAisleDto,
  ): Promise<Aisle> {
    return await this.aisleService.updateAisle(aisleDto, req.user as User);
  }

  /**
   * Update one aisle
   * @param aisleDto the user's input
   * @returns the updated aisle
   */
  @Put()
  @Roles('super admin', 'store manager', 'purchasing manager')
  @UseInterceptors(StoreInterceptor)
  async updateAisle(
    @Req() req: Request,
    @Body() aisleDto: UpdateAisleDto,
  ): Promise<Aisle> {
    return await this.aisleService.updateAisle(aisleDto, req.user as User);
  }

  /**
   * Delete one aisle
   */
  @HttpCode(204)
  @Delete('/delete/:id')
  @Roles('super admin', 'store manager', 'purchasing manager')
  async deleteAisle(
    @Req() req: Request,
    @Param() param: AisleIdParamDto,
  ): Promise<void> {
    await this.aisleService.deleteAisle(param.id, req.user as User);
  }
}
