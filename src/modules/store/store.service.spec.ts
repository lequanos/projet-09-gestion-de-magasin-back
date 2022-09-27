import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Store } from '../../entities';
import { StoreService } from './store.service';

describe('StoreService', () => {
  let service: StoreService;

  const mockStoreRepository = {
    findAll: jest.fn().mockImplementation(() => {
      const store = new Store();
      store.id = 1;
      store.name = 'NameTest';
      store.address = 'AddressTest';
      return Promise.resolve([store]);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: getRepositoryToken(Store),
          useValue: mockStoreRepository,
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
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
  });
});
