import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import {
  EntityManager,
  EntityRepository,
  wrap,
  EntityField,
  QueryOrder,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs/mikro-orm.common';

import { isNotFoundError } from '../../utils/typeguards/ExceptionTypeGuards';
import { Supplier, SupplierStats, User } from '../../entities';
import { getFieldsFromQuery } from '../../utils/helpers/getFieldsFromQuery';
import { CreateSupplierDto, UpdateSupplierDto } from './supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: EntityRepository<Supplier>,
    private readonly logger: Logger = new Logger('SupplierService'),
    private readonly em: EntityManager,
  ) {}

  /**
   * Get all Suppliers who are active
   */
  async getAll(
    user: Partial<User>,
    selectParams: string[] = [],
    nestedParams: string[] = [],
  ): Promise<Supplier[]> {
    try {
      const fields = getFieldsFromQuery(
        selectParams,
        nestedParams,
        this.em,
        'supplier',
      );

      return await this.supplierRepository.find(
        {},
        {
          fields: fields.length
            ? (fields as EntityField<Supplier, never>[])
            : undefined,
          orderBy: { id: QueryOrder.ASC },
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
   * Get one Supplier by ID
   * @param id the searched id number
   * @returns the supplier
   */
  async getOneSupplier(
    id: number,
    user: Partial<User>,
    selectParams: string[] = [],
    nestedParams: string[] = [],
  ): Promise<Supplier> {
    try {
      const fields = getFieldsFromQuery(
        selectParams,
        nestedParams,
        this.em,
        'supplier',
      );

      return await this.supplierRepository.findOneOrFail(
        {
          id,
        },
        {
          fields: fields.length
            ? (fields as EntityField<Supplier, never>[])
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
   * Create Supplier
   * @params createSupplierDto
   * @returns supplier created
   */
  async createSupplier(
    createSupplierDto: CreateSupplierDto,
    user: Partial<User>,
  ): Promise<Supplier> {
    try {
      const foundSupplier = await this.supplierRepository.findOne(
        {
          siren: createSupplierDto.siren,
        },
        { filters: { fromStore: { user } } },
      );

      if (foundSupplier)
        throw new ConflictException(
          `Supplier already exists${
            foundSupplier.isActive ? '' : ' but is deactivated'
          }`,
        );

      const supplier = this.supplierRepository.create(createSupplierDto);
      await this.supplierRepository.persistAndFlush(supplier);
      this.em.clear();
      return await this.getOneSupplier(supplier.id, user);
    } catch (e) {
      this.logger.error(`${e.message} `, e);
      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }
      throw e;
    }
  }

  /**
   * Update a supplier
   * @param supplierDto
   * @returns the updated supplier
   */
  async updateSupplier(
    supplierDto: UpdateSupplierDto,
    user: Partial<User>,
  ): Promise<Supplier> {
    try {
      const supplierToUpdate = await this.supplierRepository.findOneOrFail(
        supplierDto.id,
        { filters: { fromStore: { user } } },
      );

      const foundSupplier = await this.supplierRepository.findOne(
        {
          name: supplierDto.name,
        },
        { filters: { fromStore: { user } } },
      );

      if (foundSupplier) {
        throw new ConflictException(`${supplierDto.name} existe deja`);
      }

      if (!supplierToUpdate?.isActive)
        throw new ConflictException('Supplier is deactivated');

      wrap(supplierToUpdate).assign({
        ...supplierDto,
      });

      await this.supplierRepository.persistAndFlush(supplierToUpdate);
      this.em.clear();
      return await this.getOneSupplier(supplierToUpdate.id, user);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * desactivate a supplier
   * @param id
   * @returns the desactivated supplier
   */
  async deactivateSupplier(id: number, user: Partial<User>): Promise<Supplier> {
    try {
      const supplier = await this.supplierRepository.findOneOrFail(
        { id },
        {
          filters: { fromStore: { user } },
        },
      );

      if (!supplier.isActive)
        throw new ConflictException('Supplier is already deactivated');

      supplier.isActive = false;
      await this.supplierRepository.persistAndFlush(supplier);
      this.em.clear();
      return await this.getOneSupplier(supplier.id, user);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }
  /**
   * Reactivate a supplier
   * @param id
   * @returns the reactivated supplier
   */
  async reactivateSupplier(id: number, user: Partial<User>): Promise<Supplier> {
    try {
      const supplier = await this.supplierRepository.findOneOrFail(
        { id },
        {
          filters: { fromStore: { user } },
        },
      );

      if (supplier?.isActive)
        throw new ConflictException('Supplier is already activated');

      supplier.isActive = true;
      await this.supplierRepository.persistAndFlush(supplier);
      this.em.clear();
      return await this.getOneSupplier(supplier.id, user);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Delete one supplier
   * @param supplierId the id of the supplier to delete
   */
  async deleteSupplier(supplierId: number, user: Partial<User>): Promise<void> {
    try {
      const foundSupplier = await this.supplierRepository.findOneOrFail(
        { id: supplierId },
        {
          filters: { fromStore: { user } },
        },
      );

      await this.supplierRepository.removeAndFlush(foundSupplier);
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  /**
   * Get stats for dashboard card
   */
  async getStats(): Promise<SupplierStats> {
    try {
      return (await this.em.find(SupplierStats, {}))[0];
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }
}
