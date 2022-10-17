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

import { Stock, User } from '../../entities';
import { StockService } from './stock.service';
import { StockIdParamDto, StockDto } from './stock.dto';
import { Roles } from 'src/utils/decorators/roles.decorator';
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
  @Roles(
    'super admin',
    'store manager',
    'purchasing manager',
    'department manager',
  )
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
  @Roles(
    'super admin',
    'store manager',
    'purchasing manager',
    'department manager',
  )
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
  @Roles('super admin', 'store manager', 'purchasing manager')
  @UseInterceptors(StoreInterceptor)
  async createStock(
    @Req() req: Request,
    @Body() stockDto: StockDto,
  ): Promise<Stock> {
    return await this.stockService.createStock(stockDto, req.user as User);
  }
}
