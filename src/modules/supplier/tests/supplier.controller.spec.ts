import { Test, TestingModule } from '@nestjs/testing';
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
    const result = await controller.getAllSuppliers();
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    // expect(result[0].id).toBe(1);
    // expect(result[0].name).toBe('NameTest');
    // expect(result[0].city).toBe('Address test');
    expect(mockSupplierService.getAll).toBeCalledTimes(1);
  });
});
