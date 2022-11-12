import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Query,
  ParseArrayPipe,
  UseInterceptors,
} from '@nestjs/common';

import { Request } from 'express';

import { Stock, User, Permission } from '../../entities';
import { StockService } from './stock.service';
import { StockIdParamDto, StockDto } from './stock.dto';
import { Permissions } from 'src/utils/decorators/permissions.decorator';
import { StoreInterceptor } from 'src/utils/interceptors/store.interceptor';

/**
 * Controller for the stocks
 */
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  /**
   * Get all stocks
   */
  @Get()
  @Permissions(Permission.READ_ALL, Permission.READ_STOCK)
  async getAllStocks(
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
  ): Promise<Stock[]> {
    return await this.stockService.getAll(req.user as User, select, nested);
  }

  /**
   * Get one stock by id
   */
  @Get(':id')
  @Permissions(Permission.READ_ALL, Permission.READ_STOCK)
  async getOneStockById(
    @Req() req: Request,
    @Param() param: StockIdParamDto,
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
  ): Promise<Stock> {
    return await this.stockService.getOneById(
      param.id,
      req.user as User,
      select,
      nested,
    );
  }

  /**
   * Create one stock
   * @param stockDto the user's input
   * @returns the created stock
   */
  @Post()
  @Permissions(Permission.MANAGE_ALL, Permission.MANAGE_STOCK)
  @UseInterceptors(StoreInterceptor)
  async createStock(
    @Req() req: Request,
    @Body() stockDto: StockDto,
  ): Promise<Stock> {
    return await this.stockService.createStock(stockDto, req.user as User);
  }
}
