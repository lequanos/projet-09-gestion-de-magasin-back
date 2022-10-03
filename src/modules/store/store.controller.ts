import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Store } from '../../entities';
import { StoreService } from './store.service';
import { ParamDto, StoreDto } from './store.dto';

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
  async getOneStoreBySiret(@Param() param: ParamDto): Promise<Store> {
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
}
