import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityField, FilterQuery, wrap } from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

import {
  Product,
  User,
  Brand,
  Stock,
  ProductSupplier,
  Aisle,
  Category,
} from '../../entities';
import { isNotFoundError } from '../../utils/typeguards/ExceptionTypeGuards';
import { getFieldsFromQuery } from '../../utils/helpers/getFieldsFromQuery';
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
    @InjectRepository(Stock)
    private readonly stockRepository: EntityRepository<Stock>,
    @InjectRepository(ProductSupplier)
    private readonly productSupplierRepository: EntityRepository<ProductSupplier>,
    @InjectRepository(Aisle)
    private readonly aisleRepository: EntityRepository<Aisle>,
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    private readonly logger: Logger = new Logger('ProductService'),
    private readonly em: EntityManager,
  ) {}

  /**
   * Get all products that are active
   */
  async getAll(
    user: Partial<User>,
    selectParams: string[] = [],
    nestedParams: string[] = [],
  ): Promise<Product[]> {
    try {
      const fields = getFieldsFromQuery(
        selectParams,
        nestedParams,
        this.em,
        'product',
      );
      const filterQuery: FilterQuery<Product> = {};
      if (user.role?.name === 'department manager') {
        filterQuery.isActive = true;
      }
      return await this.productRepository.find(filterQuery, {
        fields: fields.length
          ? (fields as EntityField<Product, never>[])
          : undefined,
        filters: { fromStore: { user } },
      });
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
    selectParams: string[] = [],
    nestedParams: string[] = [],
  ): Promise<Product> {
    try {
      const fields = getFieldsFromQuery(
        selectParams,
        nestedParams,
        this.em,
        'product',
      );
      const filterQuery: FilterQuery<Product> = { id };
      if (user.role?.name === 'department manager') {
        filterQuery.isActive = true;
      }
      return await this.productRepository.findOneOrFail(
        filterQuery,

        {
          fields: fields.length
            ? (fields as EntityField<Product, string>[])
            : [
                'id',
                'name',
                'code',
                'price',
                'pictureUrl',
                'nutriScore',
                'ecoScore',
                'unitPackaging',
                'threshold',
                'ingredients',
                'isActive',
                'categories',
                'store',
                {
                  store: ['id'],
                },
                'brand',
                {
                  brand: ['name'],
                },
                'suppliers',
                {
                  suppliers: ['id'],
                },
                'inStock',
                'productSuppliers',
                {
                  productSuppliers: ['supplier', 'purchasePrice'],
                },
              ],
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
   * Create a product from a user input
   * @param productDto the user's input
   * @returns the created product
   */
  async createProduct(
    productDto: CreateProductDto,
    user: Partial<User>,
  ): Promise<Product> {
    this.em.begin();
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
        this.brandRepository.persist(brand);
      }

      const categories = await Promise.all(
        productDto.categories.map((id) =>
          this.categoryRepository.findOneOrFail(
            { id },
            { populate: ['aisle'] },
          ),
        ),
      );

      const aisles = await Promise.all(
        categories.map((cat) =>
          this.aisleRepository.findOneOrFail({ id: cat.aisle.id }),
        ),
      );

      if ([...new Set(aisles.map((aisle) => aisle.id))].length > 1) {
        throw new BadRequestException(
          'Please select only categories from the same aisle',
        );
      }

      const stock = this.stockRepository.create({
        quantity: productDto.inStock,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const productCreated = this.productRepository.create({
        ...productDto,
        brand,
        stock,
      });

      this.productRepository.persist(productCreated);

      await this.em.commit();
      this.em.clear();
      return await this.getOneById(productCreated.id, user);
    } catch (e) {
      this.logger.error(`${e.message} `, e);
      await this.em.rollback();
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
    this.em.begin();
    try {
      const foundProduct = await this.productRepository.findOneOrFail(
        productDto.id,
        {
          filters: { fromStore: { user } },
          populate: ['productSuppliers', 'categories', 'stock', 'brand'],
        },
      );
      if (foundProduct.name === productDto.name) {
        throw new ConflictException(`${productDto.name} existe deja`);
      }

      if (!foundProduct?.isActive)
        throw new ConflictException('Product is deactivated');

      let brand = await this.brandRepository.findOne({
        name: productDto.brand || foundProduct.brand.name,
      });

      if (!brand) {
        brand = this.brandRepository.create({
          name: productDto.brand,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        this.brandRepository.persist(brand);
      }

      const categories = await Promise.all(
        productDto.categories.map((id) =>
          this.categoryRepository.findOneOrFail(
            { id },
            { populate: ['aisle'] },
          ),
        ),
      );

      const aisles = await Promise.all(
        categories.map((cat) =>
          this.aisleRepository.findOneOrFail({ id: cat.aisle.id }),
        ),
      );

      if ([...new Set(aisles.map((aisle) => aisle.id))].length > 1) {
        throw new BadRequestException(
          'Please select only categories from the same aisle',
        );
      }

      const productSuppliers = productDto.productSuppliers?.map(
        (ps) => new ProductSupplier(ps.supplier, ps.product, ps.purchasePrice),
      );

      if (productDto.inStock) {
        foundProduct.stock.add(
          new Stock(productDto.inStock - foundProduct.inStock),
        );
      }

      wrap(foundProduct).assign({
        ...productDto,
        brand,
        productSuppliers,
      });

      this.productRepository.persist(foundProduct);
      await this.em.commit();
      this.em.clear();
      return await this.getOneById(foundProduct.id, user);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }
      this.em.rollback();
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
          populate: ['productSuppliers', 'categories', 'stock', 'brand'],
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
