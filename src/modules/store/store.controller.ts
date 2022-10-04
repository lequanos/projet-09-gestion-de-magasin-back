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
} from '@nestjs/common';

import { Store } from '../../entities';
import { StoreService } from './store.service';
import {
  SiretParamDto,
  StoreIdParamDto,
  StoreDto,
  UpdateStoreDto,
} from './store.dto';

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
  async getAllStores(): Promise<Store[]> {
    return await this.storeService.getAll();
  }

  /**
   * Get one store by siret
   */
  @Get(':siret')
  async getOneStoreBySiret(@Param() param: SiretParamDto): Promise<Store> {
    return await this.storeService.getOneBySiret(param.siret);
  }

  /**
   * Create one store
   * @param storeDto the user's input
   * @returns the created store
   */
  @Post()
  async createStore(@Body() storeDto: StoreDto): Promise<Store> {
    return await this.storeService.createStore(storeDto);
  }

  /**
   * Update partially one store
   * @param storeDto the user's input
   * @returns the updated store
   */
  @Patch()
  async updatePartialStore(@Body() storeDto: UpdateStoreDto): Promise<Store> {
    return await this.storeService.updateStore(storeDto);
  }

  /**
   * Update one store
   * @param storeDto the user's input
   * @returns the updated store
   */
  @Put()
  async updateStore(@Body() storeDto: UpdateStoreDto): Promise<Store> {
    return await this.storeService.updateStore(storeDto);
  }

  /**
   * Deactivate one store
   */
  @Delete(':id')
  async deactivateStore(@Param() param: StoreIdParamDto): Promise<Store> {
    return await this.storeService.deactivateStore(param.id);
  }

  /**
   * Reactivate one store
   */
  @Patch(':id')
  async reactivateStore(@Param() param: StoreIdParamDto): Promise<Store> {
    return await this.storeService.reactivateStore(param.id);
  }

  /**
   * Delete one store
   */
  @HttpCode(204)
  @Delete('/delete/:id')
  async deleteStore(@Param() param: StoreIdParamDto): Promise<void> {
    await this.storeService.deleteStore(param.id);
  }
}
