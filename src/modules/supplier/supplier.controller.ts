/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Supplier } from '../../entities';
import { CreateSupplierDTO } from './create-supplier-dto';
import { SupplierService } from './supplier.service';

/**
 * Controller for the suppliers
 */
@Controller('supplier')
export class SupplierController {
    supplierRepository: any;
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

    /**
   * Create Supplier
   */
     @Post()
     async createSupplier(@Body() supp: CreateSupplierDTO): Promise<Supplier> {
         console.log(supp)
         return this.supplierService.createSupplier(supp);
     }
}