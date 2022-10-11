import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
import { Supplier } from '../../entities';
import {
  SupplierDto,
  SupplierIdParamDto,
  UpdateSupplierDto,
} from './supplier.dto';
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
  async createSupplier(@Body() supplierDto: SupplierDto): Promise<Supplier> {
    return await this.supplierService.createSupplier(supplierDto);
  }

  /**
   * Update partially one supplier
   * @param supplierDto the user's input
   * @returns the updated store
   */

  @Patch()
  async updatePartialSupplier(
    @Body() supplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    return await this.supplierService.updateSupplier(supplierDto);
  }

  /**
   * Update one supplier
   * @param supplierDto the user's input
   * @returns the updated store
   */

  @Put()
  async updateSupplier(
    @Body() supplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    return await this.supplierService.updateSupplier(supplierDto);
  }

  /**
   * Deactivate a supplier
   * @param param
   * @returns
   */
  @Delete(':id')
  async deactivateSupplier(
    @Param() param: SupplierIdParamDto,
  ): Promise<Supplier> {
    return await this.supplierService.deactivateSupplier(param.id);
  }
  /**
   * Reactivate a supplier
   * @param param
   * @returns
   */
  @Patch(':id')
  async reactivateSupplier(
    @Param() param: SupplierIdParamDto,
  ): Promise<Supplier> {
    return await this.supplierService.reactivateSupplier(param.id);
  }

  /**
   * Delete Supplier
   */
  @HttpCode(204)
  @Delete('/delete/:id')
  async deleteSupplier(@Param() param: SupplierIdParamDto): Promise<void> {
    await this.supplierService.deleteStore(param.id);
  }
}
