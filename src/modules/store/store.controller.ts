import { Controller, Get, Param } from '@nestjs/common';
import { Store } from 'src/entities';
import { StoreService } from './store.service';
import { ParamDto } from './store.dto';

/**
 * Controller for the stores
 */
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  /**
   * Get all Stores
   */
  @Get()
  async getAllStores(): Promise<Store[]> {
    return await this.storeService.getAll();
  }

  /**
   * Get one store by siren
   */
  @Get(':siren')
  async getOneStoreBySiren(@Param() param: ParamDto): Promise<Store> {
    console.log(param);
    return await this.storeService.getOneBySiren(param.siren);
  }
}
