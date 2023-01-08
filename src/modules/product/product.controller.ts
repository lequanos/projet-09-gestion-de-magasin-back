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
  Query,
  ParseArrayPipe,
} from '@nestjs/common';

import { Request } from 'express';

import { ProductService } from './product.service';
import { Permissions } from '../../utils/decorators/permissions.decorator';
import { Product, User, Permission, ProductStats } from '../../entities';
import {
  ProductIdParamDto,
  CreateProductDto,
  UpdateProductDto,
} from './product.dto';
import { StoreInterceptor } from '../../utils/interceptors/store.interceptor';

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
  @Permissions(Permission.READ_ALL, Permission.READ_PRODUCT)
  async getAllProducts(
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
  ): Promise<Product[]> {
    return await this.productService.getAll(req.user as User, select, nested);
  }

  /**
   * Get product stats for dashboard
   */
  @Get('stats')
  @Permissions(Permission.READ_ALL, Permission.READ_PRODUCT)
  async getProductsStats(@Req() req: Request): Promise<ProductStats> {
    return await this.productService.getStats(req.user as User);
  }

  /**
   * Search for products
   */
  @Get('search')
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_PRODUCT)
  async searchProducts(
    @Req() req: Request,
    @Query('search') search: string,
  ): Promise<Product> {
    return await this.productService.searchProducts(req.user as User, search);
  }

  /**
   * Get one product by id
   */
  @Get(':id')
  @Permissions(Permission.READ_ALL, Permission.READ_PRODUCT)
  async getOneProductById(
    @Req() req: Request,
    @Param() param: ProductIdParamDto,
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
  ): Promise<Product> {
    return await this.productService.getOneById(
      param.id,
      req.user as User,
      select,
      nested,
    );
  }

  /**
   * Create one product
   * @param createUserDto the user's input
   * @returns the created product
   */
  @Post()
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_PRODUCT)
  @UseInterceptors(StoreInterceptor)
  async createProduct(
    @Req() req: Request,
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return await this.productService.createProduct(
      createProductDto,
      req.user as User,
    );
  }

  /**
   * Update partially one product
   * @param updateProductDto the user's input
   * @returns the updated product
   */
  @Patch()
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_PRODUCT)
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
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_PRODUCT)
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
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_PRODUCT)
  async deactivateProduct(
    @Req() req: Request,
    @Param() param: ProductIdParamDto,
  ): Promise<Product | null> {
    return await this.productService.deactivateProduct(
      param.id,
      req.user as User,
    );
  }

  /**
   * Reactivate one product
   */
  @Patch(':id')
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_PRODUCT)
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
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_PRODUCT)
  async deleteProduct(
    @Req() req: Request,
    @Param() param: ProductIdParamDto,
  ): Promise<void> {
    await this.productService.deleteProduct(param.id, req.user as User);
  }
}
