import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseInterceptors,
  Patch,
  Delete,
  HttpCode,
  Put,
} from '@nestjs/common';

import { Request } from 'express';

import { ProductService } from './product.service';
import { Roles } from '../../utils/decorators/roles.decorator';
import { Product, User } from '../../entities';
import {
  ProductIdParamDto,
  CreateProductDto,
  UpdateProductDto,
} from './product.dto';
import { StoreInterceptor } from 'src/utils/interceptors/store.interceptor';

/**
 * Controller for the products
 */
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Get all products
   */
  @Get()
  @Roles(
    'super admin',
    'store manager',
    'purchasing manager',
    'department manager',
  )
  async getAllUsers(@Req() req: Request): Promise<Product[]> {
    return await this.productService.getAll(req.user as User);
  }

  /**
   * Get one product by id
   */
  @Get(':id')
  @Roles(
    'super admin',
    'store manager',
    'purchasing manager',
    'department manager',
  )
  async getOneProductById(
    @Req() req: Request,
    @Param() param: ProductIdParamDto,
  ): Promise<Product> {
    return await this.productService.getOneById(param.id, req.user as User);
  }

  /**
   * Create one product
   * @param createUserDto the user's input
   * @returns the created product
   */
  @Post()
  @Roles('super admin', 'store manager', 'purchasing manager')
  @UseInterceptors(StoreInterceptor)
  async createProduct(
    @Req() req: Request,
    @Body() createUserDto: CreateProductDto,
  ): Promise<Product> {
    return await this.productService.createProduct(
      createUserDto,
      req.user as User,
    );
  }

  /**
   * Update partially one product
   * @param updateProductDto the user's input
   * @returns the updated product
   */
  @Patch()
  @Roles('super admin', 'store manager', 'purchasing manager')
  @UseInterceptors(StoreInterceptor)
  async updatePartialProduct(
    @Req() req: Request,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productService.updateProduct(
      updateProductDto,
      req.user as User,
    );
  }

  /**
   * Update one product
   * @param updateProductDto the user's input
   * @returns the updated product
   */
  @Put()
  @Roles('super admin', 'store manager', 'purchasing manager')
  @UseInterceptors(StoreInterceptor)
  async updateProduct(
    @Req() req: Request,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productService.updateProduct(
      updateProductDto,
      req.user as User,
    );
  }

  /**
   * Deactivate one product
   */
  @Delete(':id')
  @Roles('super admin', 'store manager', 'purchasing manager')
  async deactivateProduct(
    @Req() req: Request,
    @Param() param: ProductIdParamDto,
  ): Promise<Product> {
    return await this.productService.deactivateProduct(
      param.id,
      req.user as User,
    );
  }

  /**
   * Reactivate one product
   */
  @Patch(':id')
  @Roles('super admin', 'store manager', 'purchasing manager')
  async reactivateProduct(
    @Req() req: Request,
    @Param() param: ProductIdParamDto,
  ): Promise<Product> {
    return await this.productService.reactivateProduct(
      param.id,
      req.user as User,
    );
  }

  /**
   * Delete one product
   */
  @HttpCode(204)
  @Delete('/delete/:id')
  @Roles('super admin', 'store manager', 'purchasing manager')
  async deleteProduct(
    @Req() req: Request,
    @Param() param: ProductIdParamDto,
  ): Promise<void> {
    await this.productService.deleteProduct(param.id, req.user as User);
  }
}
