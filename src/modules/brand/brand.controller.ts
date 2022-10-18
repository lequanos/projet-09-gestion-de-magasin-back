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

import { Brand } from '../../entities';
import { BrandService } from './brand.service';
import { BrandIdParamDto, BrandDto, UpdateBrandDto } from './brand.dto';
import { Roles } from '../../utils/decorators/roles.decorator';

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
  @Roles('super admin', 'store manager', 'purchasing manager')
  async getAllBrands(): Promise<Brand[]> {
    return await this.brandService.getAll();
  }

  /**
   * Get one brand by id
   */
  @Get(':id')
  @Roles('super admin', 'store manager', 'purchasing manager')
  async getOneBrandById(@Param('id') id: number): Promise<Brand> {
    return await this.brandService.getOneById(id);
  }

  /**
   * Create one brand
   * @param brandDto the user's input
   * @returns the created brand
   */
  @Post()
  @Roles('super admin', 'store manager', 'purchasing manager')
  async createBrand(@Body() brandDto: BrandDto): Promise<Brand> {
    return await this.brandService.createBrand(brandDto);
  }

  /**
   * Update one brand
   * @param brandDto the user's input
   * @returns the updated brand
   */
  @Put()
  @Roles('super admin', 'store manager', 'purchasing manager')
  async updateBrand(@Body() brandDto: UpdateBrandDto): Promise<Brand> {
    return await this.brandService.updateBrand(brandDto);
  }

  /**
   * Delete one brand
   */
  @HttpCode(204)
  @Delete('/delete/:id')
  @Roles('super admin', 'store manager', 'purchasing manager')
  async deleteBrand(@Param() param: BrandIdParamDto): Promise<void> {
    await this.brandService.deleteBrand(param.id);
  }
}
