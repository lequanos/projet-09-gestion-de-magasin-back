import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { EntityField, EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Stock, User, Product } from '../../entities';
import { isNotFoundError } from '../../utils/typeguards/ExceptionTypeGuards';

import { StockDto } from './stock.dto';
import { getFieldsFromQuery } from 'src/utils/helpers/getFieldsFromQuery';
import { MailService } from '../mail/mail.service';

/**
 * Service for the stocks
 */
@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: EntityRepository<Stock>,
    private readonly logger: Logger = new Logger('StockService'),
    private readonly em: EntityManager,
    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,
    private readonly mailService: MailService,
  ) {}

  /**
   * Get all stocks that are active
   */
  async getAll(
    user: Partial<User>,
    selectParams: string[] = [],
    nestedParams: string[] = [],
  ): Promise<Stock[]> {
    try {
      const fields = getFieldsFromQuery(
        selectParams,
        nestedParams,
        this.em,
        'stock',
      );

      return await this.stockRepository.find(
        {},
        {
          fields: fields.length
            ? (fields as EntityField<Stock, never>[])
            : undefined,
          filters: { fromStore: { user } },
        },
      );
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Get one stock by id
   * @param id the searched stock's identifier
   * @returns the found stock
   */
  async getOneById(
    id: number,
    user: Partial<User>,
    selectParams: string[] = [],
    nestedParams: string[] = [],
  ): Promise<Stock> {
    try {
      const fields = getFieldsFromQuery(
        selectParams,
        nestedParams,
        this.em,
        'stock',
      );
      return await this.stockRepository.findOneOrFail(
        { id },
        {
          fields: fields.length
            ? (fields as EntityField<Stock, never>[])
            : undefined,
          filters: { fromStore: { user } },
        },
      );
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Create a stock from a user input
   * @param stockDto the user's input
   * @returns the created stock
   */
  async createStock(stockDto: StockDto, user: Partial<User>): Promise<Stock> {
    try {
      const product = await this.productRepository.findOne({
        id: stockDto.product,
      });

      if (!product) {
        throw new ConflictException('Product not found');
      }
      const stock = this.stockRepository.create(stockDto);
      await this.stockRepository.persistAndFlush(stock);
      this.em.clear();

      if (product.inStock <= product.threshold) {
        await this.mailService.sendEmailToPurchasingManagers({
          product,
        });
      }

      return await this.getOneById(stock.id, user);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      throw e;
    }
  }
}
