/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from '@nestjs/common';
import { Supplier } from '../../entities';
import { SupplierService } from './supplier.service';

/**
 * Controller for the suppliers
 */
@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

   /**
   * Get all Suppliers
   */
    @Get()
    async getAllSuppliers(): Promise<Supplier[]> {
        return await this.supplierService.getAll();
    }

    /**
   * Get one Supplier
   */
     @Get(':id')
     async getOneSupplier(@Param('id') id: number): Promise<Supplier> {
         return await this.supplierService.getOneSupplier(id);
     }
}
