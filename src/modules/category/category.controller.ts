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

import { Category, User, Permission } from '../../entities';
import { CategoryService } from './category.service';
import {
  CategoryIdParamDto,
  CategoryDto,
  UpdateCategoryDto,
} from './category.dto';
import { Permissions } from 'src/utils/decorators/permissions.decorator';
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
  @Permissions(Permission.READ_ALL, Permission.READ_CATEGORY)
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
  @Permissions(Permission.READ_ALL, Permission.READ_CATEGORY)
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
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_CATEGORY)
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
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_CATEGORY)
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
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_CATEGORY)
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
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_CATEGORY)
  async deleteCategory(
    @Req() req: Request,
    @Param() param: CategoryIdParamDto,
  ): Promise<void> {
    await this.categoryService.deleteCategory(param.id, req.user as User);
  }
}
