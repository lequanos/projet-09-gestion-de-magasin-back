import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from '../store.controller';
import { StoreService } from '../store.service';
import { Store } from '../../../entities';
import { Logger } from '@nestjs/common';

describe('StoreController', () => {
  let controller: StoreController;
  const store = new Store();
  store.id = 1;
  store.name = 'NameTest';
  store.address = 'AddressTest';
  store.siren = '111111111';
  store.siret = '11111111111111';
  store.isActive = true;

  const mockStoreService = {
    getAll: jest.fn(() => {
      return [store];
    }),
    getOneBySiret: jest.fn(() => {
      return store;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [StoreService, Logger],
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

  it('should return one store', async () => {
    const result = await controller.getOneStoreBySiret({
      siret: '11111111111111',
    });
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result.name).toBe('NameTest');
    expect(result.address).toBe('AddressTest');
    expect(mockStoreService.getOneBySiret).toBeCalledTimes(1);
  });
});
