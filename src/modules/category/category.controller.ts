import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpCode,
  Req,
  Query,
  ParseArrayPipe,
  UseInterceptors,
  Patch,
} from '@nestjs/common';

import { Request } from 'express';

import { Category, User } from '../../entities';
import { CategoryService } from './category.service';
import {
  CategoryIdParamDto,
  CategoryDto,
  UpdateCategoryDto,
} from './category.dto';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { StoreInterceptor } from 'src/utils/interceptors/store.interceptor';

/**
 * Controller for the categorys
 */
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Get all categories
   */
  @Get()
  @Roles(
    'super admin',
    'store manager',
    'purchasing manager',
    'department manager',
  )
  async getAllCategorys(
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
  ): Promise<Category[]> {
    return await this.categoryService.getAll(req.user as User, select, nested);
  }

  /**
   * Get one category by id
   */
  @Get(':id')
  @Roles(
    'super admin',
    'store manager',
    'purchasing manager',
    'department manager',
  )
  async getOneCategoryById(
    @Req() req: Request,
    @Param() param: CategoryIdParamDto,
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
  ): Promise<Category> {
    return await this.categoryService.getOneById(
      param.id,
      req.user as User,
      select,
      nested,
    );
  }

  /**
   * Create one category
   * @param categoryDto the user's input
   * @returns the created category
   */
  @Post()
  @Roles('super admin', 'store manager', 'purchasing manager')
  @UseInterceptors(StoreInterceptor)
  async createCategory(
    @Req() req: Request,
    @Body() categoryDto: CategoryDto,
  ): Promise<Category> {
    return await this.categoryService.createCategory(
      categoryDto,
      req.user as User,
    );
  }

  /**
   * Update one Partial category
   * @param categoryDto the user's input
   * @returns the updated category
   */
  @Patch()
  @Roles('super admin', 'store manager', 'purchasing manager')
  @UseInterceptors(StoreInterceptor)
  async updatePartialCategory(
    @Req() req: Request,
    @Body() categoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.updateCategory(
      categoryDto,
      req.user as User,
    );
  }

  /**
   * Update one category
   * @param categoryDto the user's input
   * @returns the updated category
   */
  @Put()
  @Roles('super admin', 'store manager', 'purchasing manager')
  @UseInterceptors(StoreInterceptor)
  async updateCategory(
    @Req() req: Request,
    @Body() categoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.updateCategory(
      categoryDto,
      req.user as User,
    );
  }

  /**
   * Delete one category
   */
  @HttpCode(204)
  @Delete('/delete/:id')
  @Roles('super admin', 'store manager', 'purchasing manager')
  async deleteCategory(
    @Req() req: Request,
    @Param() param: CategoryIdParamDto,
  ): Promise<void> {
    await this.categoryService.deleteCategory(param.id, req.user as User);
  }
}
