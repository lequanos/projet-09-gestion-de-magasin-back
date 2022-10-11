import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { wrap } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

import { Product, User, Brand, Stock } from '../../entities';
import { isNotFoundError } from '../../utils/typeguards/ExceptionTypeGuards';
import { CreateProductDto, UpdateProductDto } from './product.dto';

/**
 * Service for the products
 */
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,
    @InjectRepository(Brand)
    private readonly brandRepository: EntityRepository<Brand>,
    private readonly logger: Logger = new Logger('ProductService'),
    private readonly em: EntityManager,
  ) {}

  /**
   * Get all products that are active
   */
  async getAll(user: Partial<User>): Promise<Product[]> {
    try {
      const qb = this.em.createQueryBuilder(Product).getKnex();

      qb.select([
        'product.name',
        'product.code',
        'product.price',
        'product.picture_url as pictureUrl',
        'product.nutri_score as nutriScore',
        'product.eco_score as ecoScore',
        'product.unit_packaging as unitPackaging',
        'product.ingredients',
        'brand.name as brandName',
      ])
        .sum({ inStock: 'stock.quantity' })
        .join('brand', 'product.brand_id', '=', 'brand.id')
        .join('stock', 'product.id', '=', 'stock.product_id')
        .modify((queryBuilder) => {
          if (user.store?.id) {
            queryBuilder.andWhere('product.store_id', user.store?.id);
          }
        })
        .andWhere('product.is_active', true)
        .groupBy(
          'stock.product_id',
          'product.name',
          'product.code',
          'product.nutri_score',
          'product.eco_score',
          'product.picture_url',
          'product.unit_packaging',
          'product.ingredients',
          'product.price',
          'brand.name',
        );

      const result = await this.em.getConnection().execute(qb);

      return result as Product[];
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Get one product by id
   * @param id the searched product's identifier
   * @returns the found product
   */
  async getOneById(
    id: number,
    user: Partial<User>,
    isActive = true,
  ): Promise<Product> {
    try {
      const qb = this.em.createQueryBuilder(Product).getKnex();

      qb.select([
        'product.name',
        'product.code',
        'product.price',
        'product.picture_url as pictureUrl',
        'product.nutri_score as nutriScore',
        'product.eco_score as ecoScore',
        'product.unit_packaging as unitPackaging',
        'product.ingredients',
        'brand.name as brandName',
      ])
        .sum({ inStock: 'stock.quantity' })
        .join('brand', 'product.brand_id', '=', 'brand.id')
        .join('stock', 'product.id', '=', 'stock.product_id')
        .where('product_id', id)
        .modify((queryBuilder) => {
          if (user.store?.id) {
            queryBuilder.andWhere('product.store_id', user.store?.id);
          }
        })
        .andWhere('product.is_active', isActive)
        .groupBy(
          'stock.product_id',
          'product.name',
          'product.code',
          'product.nutri_score',
          'product.eco_score',
          'product.picture_url',
          'product.unit_packaging',
          'product.ingredients',
          'product.price',
          'brand.name',
        );

      const result = await this.em.getConnection().execute(qb);
      if (!result.length) throw new Error('Product not found');
      return result[0] as Product;
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Create a product from a user input
   * @param productDto the user's input
   * @returns the created product
   */
  async createProduct(
    productDto: CreateProductDto,
    user: Partial<User>,
  ): Promise<Product> {
    try {
      const foundProduct = await this.productRepository.findOne(
        {
          code: productDto.code,
        },
        { filters: { fromStore: { user } } },
      );

      if (foundProduct)
        throw new ConflictException(
          `Product already exists${
            foundProduct.isActive ? '' : ' but is deactivated'
          }`,
        );

      let brand = await this.brandRepository.findOne({
        name: productDto.brand,
      });

      if (!brand) {
        brand = this.brandRepository.create({
          name: productDto.brand,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await this.brandRepository.persistAndFlush(brand);
      }

      const productCreated = this.productRepository.create({
        ...productDto,
        brand,
      });

      await this.productRepository.persistAndFlush(productCreated);
      this.em.clear();
      return await this.getOneById(productCreated.id, user);
    } catch (e) {
      this.logger.error(`${e.message} `, e);
      throw e;
    }
  }

  /**
   * Update a product from a user input
   * @param productDto the user's input
   * @returns the updated product
   */
  async updateProduct(
    productDto: UpdateProductDto,
    user: Partial<User>,
  ): Promise<Product> {
    try {
      const foundProduct = await this.productRepository.findOneOrFail(
        productDto.id,
        {
          filters: { fromStore: { user } },
        },
      );

      if (!foundProduct?.isActive)
        throw new ConflictException('Product is deactivated');

      let brand = await this.brandRepository.findOne({
        name: productDto.brand,
      });

      if (!brand) {
        brand = this.brandRepository.create({
          name: productDto.brand,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await this.brandRepository.persistAndFlush(brand);
      }

      wrap(foundProduct).assign({
        ...productDto,
        brand,
      });

      await this.productRepository.persistAndFlush(foundProduct);
      this.em.clear();
      return await this.getOneById(foundProduct.id, user);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Deactivate one product
   * @param productId the identifier of the product to soft delete
   * @returns the deactivated product
   */
  async deactivateProduct(
    productId: number,
    user: Partial<User>,
  ): Promise<Product> {
    try {
      const foundProduct = await this.productRepository.findOneOrFail(
        productId,
        {
          filters: { fromStore: { user } },
        },
      );

      if (!foundProduct?.isActive)
        throw new ConflictException('Product is already deactivated');

      foundProduct.isActive = false;
      await this.productRepository.persistAndFlush(foundProduct);
      this.em.clear();
      return await this.getOneById(foundProduct.id, user, false);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Reactivate one product
   * @param productId the identifier of the product to reactivate
   * @returns the reactivated product
   */
  async reactivateProduct(
    productId: number,
    user: Partial<User>,
  ): Promise<Product> {
    try {
      const foundProduct = await this.productRepository.findOneOrFail(
        productId,
        {
          filters: { fromStore: { user } },
        },
      );

      if (foundProduct?.isActive)
        throw new ConflictException('Product is already activated');

      foundProduct.isActive = true;

      await this.productRepository.persistAndFlush(foundProduct);
      this.em.clear();
      return await this.getOneById(foundProduct.id, user);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Delete one product
   * @param productId the identifier of the product to delete
   */
  async deleteProduct(productId: number, user: Partial<User>): Promise<void> {
    try {
      const foundProduct = await this.productRepository.findOneOrFail(
        productId,
        {
          filters: { fromStore: { user } },
        },
      );
      await this.productRepository.removeAndFlush(foundProduct);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }
}
