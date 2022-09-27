import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { Store } from '../../entities';

describe('StoreController', () => {
  let controller: StoreController;

  const mockStoreService = {
    getAll: jest.fn(() => {
      const store = new Store();
      store.id = 1;
      store.name = 'NameTest';
      store.address = 'AddressTest';
      return [store];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [StoreService],
    })
      .overrideProvider(StoreService)
      .useValue(mockStoreService)
      .compile();

    controller = module.get<StoreController>(StoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return array of Store', async () => {
    const result = await controller.getAllStores();
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(1);
    expect(result[0].name).toBe('NameTest');
    expect(result[0].address).toBe('AddressTest');
    expect(mockStoreService.getAll).toBeCalledTimes(1);
  });
});
