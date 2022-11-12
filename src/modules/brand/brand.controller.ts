import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpCode,
} from '@nestjs/common';

import { Brand, Permission } from '../../entities';
import { BrandService } from './brand.service';
import { BrandIdParamDto, BrandDto, UpdateBrandDto } from './brand.dto';
import { Permissions } from '../../utils/decorators/permissions.decorator';

/**
 * Controller for the brands
 */
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  /**
   * Get all brands
   */
  @Get()
  @Permissions(Permission.READ_ALL, Permission.READ_BRAND)
  async getAllBrands(): Promise<Brand[]> {
    return await this.brandService.getAll();
  }

  /**
   * Get one brand by id
   */
  @Get(':id')
  @Permissions(Permission.READ_ALL, Permission.READ_BRAND)
  async getOneBrandById(@Param('id') id: number): Promise<Brand> {
    return await this.brandService.getOneById(id);
  }

  /**
   * Create one brand
   * @param brandDto the user's input
   * @returns the created brand
   */
  @Post()
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_BRAND)
  async createBrand(@Body() brandDto: BrandDto): Promise<Brand> {
    return await this.brandService.createBrand(brandDto);
  }

  /**
   * Update one brand
   * @param brandDto the user's input
   * @returns the updated brand
   */
  @Put()
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_BRAND)
  async updateBrand(@Body() brandDto: UpdateBrandDto): Promise<Brand> {
    return await this.brandService.updateBrand(brandDto);
  }

  /**
   * Delete one brand
   */
  @HttpCode(204)
  @Delete('/delete/:id')
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_BRAND)
  async deleteBrand(@Param() param: BrandIdParamDto): Promise<void> {
    await this.brandService.deleteBrand(param.id);
  }
}
