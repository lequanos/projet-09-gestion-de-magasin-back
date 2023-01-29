import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@mikro-orm/nestjs';

import { Store, Aisle, Role, User } from '../../../entities';

import { CreateStoreDto, UpdateStoreDto } from '../store.dto';

import { StoreService } from '../store.service';
import { EntityManager } from '@mikro-orm/core';
import { HttpService } from '@nestjs/axios';
import { RoleService } from '../../role/role.service';

describe('StoreService', () => {
  let service: StoreService;
  let logger: Logger;

  const stores: Store[] = [];

  const store = new Store();
  store.id = 1;
  store.name = 'NameTest';
  store.address = 'AddressTest';
  store.siren = '111111111';
  store.siret = '11111111111111';
  store.isActive = true;

  stores.push(store);

  const storeDto = new CreateStoreDto();
  storeDto.name = 'NameTest2';
  storeDto.address = 'AddressTest2';
  storeDto.siren = '222222222';
  storeDto.siret = '22222222222222';
  storeDto.isActive = true;

  const updateStoreDto = new UpdateStoreDto();
  updateStoreDto.id = 1;
  updateStoreDto.name = 'NameUpdated';

  const mockStoreRepository = {
    find: jest.fn().mockImplementation(() => {
      return Promise.resolve([store]);
    }),
    findOneOrFail: jest.fn().mockImplementation((param) => {
      const foundStore = stores.find(
        (x) => x.id === param.id || x.siret === param.siret,
      );
      if (foundStore) {
        return Promise.resolve(foundStore);
      }
      throw new Error('Store not found');
    }),
    findOne: jest.fn().mockImplementation((param) => {
      const foundStore = stores.find(
        (x) => x.id === param || x.siret === param.siret,
      );
      if (foundStore) {
        return Promise.resolve(foundStore);
      }
      return null;
    }),
    create: jest.fn().mockImplementation((dto) => {
      const storeToCreate = new Store();
      storeToCreate.name = dto.name;
      storeToCreate.address = dto.address;
      storeToCreate.siren = dto.siren;
      storeToCreate.siret = dto.siret;
      storeToCreate.isActive = dto.isActive;
      return storeToCreate;
    }),
    persistAndFlush: jest.fn().mockImplementation((store) => {
      if (store.name === storeDto.name) {
        store.id = 2;
        stores.push(store);
        return;
      }
      throw new Error();
    }),
  };

  const mockAisleRepository = {
    create: jest.fn().mockImplementation((dto) => {
      const aisleToCreate = new Aisle();
      aisleToCreate.name = dto.name;
      aisleToCreate.store = dto.store;
      return aisleToCreate;
    }),
    persistAndFlush: jest.fn().mockImplementation(() => {
      return;
    }),
  };

  const mockRoleRepository = {
    create: jest.fn().mockImplementation((dto) => {
      const roleToCreate = new Role();
      roleToCreate.name = dto.name;
      roleToCreate.store = dto.store;
      roleToCreate.permissions = dto.permissions;
      return roleToCreate;
    }),
    persistAndFlush: jest.fn().mockImplementation(() => {
      return;
    }),
  };

  const mockUserRepository = {};

  const mockEntityManager = {
    clear: jest.fn(),
    begin: jest.fn(),
    rollback: jest.fn(),
    commit: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockRoleService = {
    createRolesForNewStore: jest.fn(),
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
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: RoleService,
          useValue: mockRoleService,
        },
        {
          provide: getRepositoryToken(Store),
          useValue: mockStoreRepository,
        },
        {
          provide: getRepositoryToken(Aisle),
          useValue: mockAisleRepository,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
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
    expect(mockStoreRepository.find).toBeCalledTimes(1);
    expect(logger.log).toBeCalledTimes(0);
  });

  it('should return one store', async () => {
    const result = await service.getOneBySiret('11111111111111');
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result.name).toBe('NameTest');
    expect(result.address).toBe('AddressTest');
    expect(result.siret).toBe('11111111111111');
    expect(mockStoreRepository.findOneOrFail).toBeCalledTimes(1);
    expect(logger.log).toBeCalledTimes(0);
  });

  it('should throw a not found error', async () => {
    await expect(service.getOneBySiret('azea')).rejects.toThrow('Not Found');
    expect(mockStoreRepository.findOneOrFail).toBeCalledTimes(2);
    expect(logger.error).toBeCalledTimes(1);
  });

  it('should create a store', async () => {
    const result = await service.createStore(storeDto);
    expect(result).toBeDefined();
    expect(result.id).toBe(2);
    expect(result.name).toBe('NameTest2');
    expect(result.address).toBe('AddressTest2');
    expect(result.siret).toBe('22222222222222');
    expect(mockStoreRepository.findOne).toBeCalledTimes(1);
    expect(mockStoreRepository.create).toBeCalledTimes(1);
    expect(mockStoreRepository.persistAndFlush).toBeCalledTimes(1);
    expect(mockEntityManager.clear).toBeCalledTimes(1);
    expect(logger.log).toBeCalledTimes(0);
  });

  it('should throw error if db is not connected', async () => {
    const storeDto = new CreateStoreDto();
    storeDto.name = 'NameTest3';
    storeDto.address = 'AddressTest2';
    storeDto.siren = '222222222';
    storeDto.siret = '22222222222222';
    storeDto.isActive = true;
    await expect(service.createStore(storeDto)).rejects.toThrow();
    expect(mockStoreRepository.create).toBeCalledTimes(1);
    expect(mockStoreRepository.persistAndFlush).toBeCalledTimes(1);
    expect(logger.error).toBeCalledTimes(1);
  });

  it('should throw error if store already exists', async () => {
    const storeDto = new CreateStoreDto();
    storeDto.name = 'NameTest3';
    storeDto.address = 'AddressTest2';
    storeDto.siren = '222222222';
    storeDto.siret = '11111111111111';
    storeDto.isActive = true;
    await expect(service.createStore(storeDto)).rejects.toThrow();
    expect(mockStoreRepository.create).toBeCalledTimes(1);
    expect(mockStoreRepository.persistAndFlush).toBeCalledTimes(1);
    expect(logger.error).toBeCalledTimes(1);
  });
});
