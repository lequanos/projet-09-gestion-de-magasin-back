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

import { Store, Permission, StoreStats } from '../../entities';
import { StoreService } from './store.service';
import {
  SiretParamDto,
  StoreIdParamDto,
  CreateStoreDto,
  UpdateStoreDto,
} from './store.dto';
import { Permissions } from '../../utils/decorators/permissions.decorator';

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
  @Permissions(Permission.READ_ALL, Permission.READ_STORE)
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
   * Search for stores
   */
  @Get('search')
  @Permissions(Permission.READ_ALL, Permission.READ_STORE)
  async searchStores(@Query('search') search: string): Promise<Store[]> {
    return await this.storeService.searchStores(search);
  }

  /**
   * Search for stores on SireneV3
   */
  @Get('search-siret')
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_STORE)
  async searchStoresSireneV3(@Query('search') search: string): Promise<Store> {
    return await this.storeService.searchStoresSireneV3(search);
  }

  /**
   * Get most active stores
   */
  @Get('most-active')
  @Permissions(Permission.READ_ALL, Permission.READ_STORE)
  async getMostActiveStores(): Promise<Store[]> {
    return await this.storeService.getAll([
      'id',
      'name',
      'city',
      'siret',
      'movement',
    ]);
  }

  /**
   * Get stores stats for dashboard
   */
  @Get('stats')
  @Permissions(Permission.READ_ALL, Permission.READ_STORE)
  async getStoresStats(): Promise<StoreStats> {
    return await this.storeService.getStats();
  }

  /**
   * Get one store by siret
   */
  @Get(':siret')
  @Permissions(Permission.READ_ALL, Permission.READ_STORE)
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
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_STORE)
  async createStore(@Body() storeDto: CreateStoreDto): Promise<Store> {
    return await this.storeService.createStore(storeDto);
  }

  /**
   * Update partially one store
   * @param storeDto the user's input
   * @returns the updated store
   */
  @Patch()
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_STORE)
  async updatePartialStore(@Body() storeDto: UpdateStoreDto): Promise<Store> {
    return await this.storeService.updateStore(storeDto);
  }

  /**
   * Update one store
   * @param storeDto the user's input
   * @returns the updated store
   */
  @Put()
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_STORE)
  async updateStore(@Body() storeDto: UpdateStoreDto): Promise<Store> {
    return await this.storeService.updateStore(storeDto);
  }

  /**
   * Deactivate one store
   */
  @Delete(':id')
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_STORE)
  async deactivateStore(@Param() param: StoreIdParamDto): Promise<Store> {
    return await this.storeService.deactivateStore(param.id);
  }

  /**
   * Reactivate one store
   */
  @Patch(':id')
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_STORE)
  async reactivateStore(@Param() param: StoreIdParamDto): Promise<Store> {
    return await this.storeService.reactivateStore(param.id);
  }

  /**
   * Delete one store
   */
  @HttpCode(204)
  @Delete('/delete/:id')
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_STORE)
  async deleteStore(@Param() param: StoreIdParamDto): Promise<void> {
    await this.storeService.deleteStore(param.id);
  }
}
