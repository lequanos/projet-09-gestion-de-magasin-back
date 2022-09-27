import { Controller, Get } from '@nestjs/common';
import { Store } from 'src/entities';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async getAllStores(): Promise<Store[]> {
    return await this.storeService.getAll();
  }
}
