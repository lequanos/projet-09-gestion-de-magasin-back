import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Put,
  HttpCode,
  ParseArrayPipe,
  Query,
} from '@nestjs/common';

import { Store } from '../../entities';
import { StoreService } from './store.service';
import {
  SiretParamDto,
  StoreIdParamDto,
  StoreDto,
  UpdateStoreDto,
} from './store.dto';
import { Roles } from '../../utils/decorators/roles.decorator';

/**
 * Controller for the stores
 */
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  /**
   * Get all stores
   */
  @Get()
  @Roles('super admin')
  async getAllStores(
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
  ): Promise<Store[]> {
    return await this.storeService.getAll(select, nested);
  }

  /**
   * Get one store by siret
   */
  @Get(':siret')
  @Roles('super admin')
  async getOneStoreBySiret(
    @Param() param: SiretParamDto,
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
  ): Promise<Store> {
    return await this.storeService.getOneBySiret(param.siret, select, nested);
  }

  /**
   * Create one store
   * @param storeDto the user's input
   * @returns the created store
   */
  @Post()
  @Roles('super admin')
  async createStore(@Body() storeDto: StoreDto): Promise<Store> {
    return await this.storeService.createStore(storeDto);
  }

  /**
   * Update partially one store
   * @param storeDto the user's input
   * @returns the updated store
   */
  @Patch()
  @Roles('super admin')
  async updatePartialStore(@Body() storeDto: UpdateStoreDto): Promise<Store> {
    return await this.storeService.updateStore(storeDto);
  }

  /**
   * Update one store
   * @param storeDto the user's input
   * @returns the updated store
   */
  @Put()
  @Roles('super admin')
  async updateStore(@Body() storeDto: UpdateStoreDto): Promise<Store> {
    return await this.storeService.updateStore(storeDto);
  }

  /**
   * Deactivate one store
   */
  @Delete(':id')
  @Roles('super admin')
  async deactivateStore(@Param() param: StoreIdParamDto): Promise<Store> {
    return await this.storeService.deactivateStore(param.id);
  }

  /**
   * Reactivate one store
   */
  @Patch(':id')
  @Roles('super admin')
  async reactivateStore(@Param() param: StoreIdParamDto): Promise<Store> {
    return await this.storeService.reactivateStore(param.id);
  }

  /**
   * Delete one store
   */
  @HttpCode(204)
  @Delete('/delete/:id')
  @Roles('super admin')
  async deleteStore(@Param() param: StoreIdParamDto): Promise<void> {
    await this.storeService.deleteStore(param.id);
  }
}
