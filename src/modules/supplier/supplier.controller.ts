import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';

import { Request } from 'express';

import { Permissions } from '../../utils/decorators/permissions.decorator';
import { Supplier, User, Permission, SupplierStats } from '../../entities';
import {
  CreateSupplierDto,
  SupplierIdParamDto,
  UpdateSupplierDto,
} from './supplier.dto';
import { SupplierService } from './supplier.service';
import { StoreInterceptor } from '../../utils/interceptors/store.interceptor';

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
  @Permissions(Permission.READ_ALL, Permission.READ_SUPPLIER)
  async getAllSuppliers(
    @Req() req: Request,
    @Query(
      'select',
      new ParseArrayPipe({
        items: String,
        separator: ',',
        optional: true,
      }),
    )
    select: string[] = [],
    @Query(
      'nested',
      new ParseArrayPipe({
        items: String,
        separator: ',',
        optional: true,
      }),
    )
    nested: string[] = [],
  ): Promise<Supplier[]> {
    return await this.supplierService.getAll(req.user as User, select, nested);
  }

  /**
   * Get supplier stats for dashboard
   */
  @Get('stats')
  @Permissions(Permission.READ_ALL, Permission.READ_SUPPLIER)
  async getSuppliersStats(): Promise<SupplierStats> {
    return await this.supplierService.getStats();
  }

  /**
   * Search for suppliers on SireneV3
   */
  @Get('search-siret')
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_SUPPLIER)
  async searchSuppliersSireneV3(
    @Req() req: Request,
    @Query('search') search: string,
  ): Promise<Supplier> {
    return await this.supplierService.searchSuppliersSireneV3(
      req.user as User,
      search,
    );
  }

  /**
   * Get one Supplier
   */
  @Get(':id')
  @Permissions(Permission.READ_ALL, Permission.READ_SUPPLIER)
  async getOneSupplier(
    @Req() req: Request,
    @Param('id') id: number,
    @Query(
      'select',
      new ParseArrayPipe({
        items: String,
        separator: ',',
        optional: true,
      }),
    )
    select: string[] = [],
    @Query(
      'nested',
      new ParseArrayPipe({
        items: String,
        separator: ',',
        optional: true,
      }),
    )
    nested: string[] = [],
  ): Promise<Supplier> {
    return await this.supplierService.getOneSupplier(
      id,
      req.user as User,
      select,
      nested,
    );
  }

  /**
   * Create Supplier
   */
  @Post()
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_SUPPLIER)
  @UseInterceptors(StoreInterceptor)
  async createSupplier(
    @Req() req: Request,
    @Body() supplierDto: CreateSupplierDto,
  ): Promise<Supplier> {
    return await this.supplierService.createSupplier(
      supplierDto,
      req.user as User,
    );
  }

  /**
   * Update partially one supplier
   * @param supplierDto the user's input
   * @returns the updated store
   */

  @Patch()
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_SUPPLIER)
  @UseInterceptors(StoreInterceptor)
  async updatePartialSupplier(
    @Req() req: Request,
    @Body() supplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    return await this.supplierService.updateSupplier(
      supplierDto,
      req.user as User,
    );
  }

  /**
   * Update one supplier
   * @param supplierDto the user's input
   * @returns the updated store
   */

  @Put()
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_SUPPLIER)
  @UseInterceptors(StoreInterceptor)
  async updateSupplier(
    @Req() req: Request,
    @Body() supplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    return await this.supplierService.updateSupplier(
      supplierDto,
      req.user as User,
    );
  }

  /**
   * Deactivate a supplier
   * @param param
   * @returns
   */
  @Delete(':id')
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_SUPPLIER)
  async deactivateSupplier(
    @Req() req: Request,
    @Param() param: SupplierIdParamDto,
  ): Promise<Supplier> {
    return await this.supplierService.deactivateSupplier(
      param.id,
      req.user as User,
    );
  }
  /**
   * Reactivate a supplier
   * @param param
   * @returns
   */
  @Patch(':id')
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_SUPPLIER)
  async reactivateSupplier(
    @Req() req: Request,
    @Param() param: SupplierIdParamDto,
  ): Promise<Supplier> {
    return await this.supplierService.reactivateSupplier(
      param.id,
      req.user as User,
    );
  }

  /**
   * Delete Supplier
   */
  @HttpCode(204)
  @Delete('/delete/:id')
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_SUPPLIER)
  async deleteSupplier(
    @Req() req: Request,
    @Param() param: SupplierIdParamDto,
  ): Promise<void> {
    await this.supplierService.deleteSupplier(param.id, req.user as User);
  }
}
