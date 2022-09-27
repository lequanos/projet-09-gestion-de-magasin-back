import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Store } from '../../entities';
import { StoreService } from './store.service';

describe('StoreService', () => {
  let service: StoreService;
  let logger: Logger;

  const store = new Store();
  store.id = 1;
  store.name = 'NameTest';
  store.address = 'AddressTest';
  store.siren = '111111111';

  const mockStoreRepository = {
    findAll: jest.fn().mockImplementation(() => {
      return Promise.resolve([store]);
    }),
    findOneOrFail: jest.fn().mockImplementation((param) => {
      if (store.siren === param.siren) {
        return store;
      }
      throw new Error('Store not found');
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Store),
          useValue: mockStoreRepository,
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return array of Store', async () => {
    const result = await service.getAll();
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(1);
    expect(result[0].name).toBe('NameTest');
    expect(result[0].address).toBe('AddressTest');
    expect(mockStoreRepository.findAll).toBeCalledTimes(1);
    expect(logger.log).toBeCalledTimes(0);
  });

  it('should return one store', async () => {
    const result = await service.getOneBySiren('111111111');
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result.name).toBe('NameTest');
    expect(result.address).toBe('AddressTest');
    expect(result.siren).toBe('111111111');
    expect(mockStoreRepository.findOneOrFail).toBeCalledTimes(1);
    expect(logger.log).toBeCalledTimes(0);
  });
});
