import { Test, TestingModule } from '@nestjs/testing';

import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { Options, Ranges, Result } from 'range-parser';

import { Supplier } from '../../../entities';
import { SupplierController } from '../supplier.controller';
import { SupplierService } from '../supplier.service';

describe('SupplierController', () => {
  let controller: SupplierController;

  const supplier = new Supplier();
  supplier.id = 1;
  supplier.name = 'NameTest';
  supplier.phoneNumber = '00 00 00 00 00';
  supplier.address = 'address test';
  supplier.postcode = '10000';
  supplier.city = 'Paris';
  supplier.siren = '000000000';
  supplier.siret = '123456789';
  supplier.contact = 'contactTest';
  supplier.isActive = true;
  supplier.pictureUrl = 'pictureTest';
  const mockSupplierService = {
    getAll: jest.fn(() => {
      return [supplier];
    }),
  };

  const mockReq: Partial<Request> = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierController],
      providers: [SupplierService],
    })
      .overrideProvider(SupplierService)
      .useValue(mockSupplierService)
      .compile();

    controller = module.get<SupplierController>(SupplierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return array of Store', async () => {
    const result = await controller.getAllSuppliers(mockReq as Request);
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(mockSupplierService.getAll).toBeCalledTimes(1);
  });
});
