import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from '../store.controller';
import { StoreService } from '../store.service';
import { Store } from '../../../entities';
import { Logger } from '@nestjs/common';
import { StoreDto } from '../store.dto';

describe('StoreController', () => {
  let controller: StoreController;
  const store = new Store();
  store.id = 1;
  store.name = 'NameTest';
  store.address = 'AddressTest';
  store.siren = '111111111';
  store.siret = '11111111111111';
  store.isActive = true;

  const storeCreated = new Store();
  storeCreated.id = 2;
  storeCreated.name = 'NameTest2';
  storeCreated.address = 'AddressTest2';
  storeCreated.siren = '222222222';
  storeCreated.siret = '22222222222222';
  storeCreated.isActive = true;

  const storeDto = new StoreDto();
  storeDto.name = 'NameTest2';
  storeDto.address = 'AddressTest2';
  storeDto.siren = '222222222';
  storeDto.siret = '22222222222222';
  storeDto.isActive = true;

  const mockStoreService = {
    getAll: jest.fn(() => {
      return [store];
    }),
    getOneBySiret: jest.fn(() => {
      return store;
    }),
    createStore: jest.fn(() => {
      return storeCreated;
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

  it('should return the created store', async () => {
    const result = await controller.createStore(storeDto);
    expect(result).toBeDefined();
    expect(result.id).toBe(2);
    expect(result.name).toBe('NameTest2');
    expect(result.address).toBe('AddressTest2');
    expect(mockStoreService.createStore).toBeCalledTimes(1);
  });
});
