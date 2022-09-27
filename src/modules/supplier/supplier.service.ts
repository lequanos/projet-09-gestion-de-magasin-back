import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs/mikro-orm.common';
import { Injectable, Param } from '@nestjs/common';
import { Supplier } from '../../entities';

@Injectable()
export class SupplierService {
  logger: any;
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: EntityRepository<Supplier>,
  ) {}

  /**
   * Get all Suppliers
   */
  async getAll(): Promise<Supplier[]> {
    return await this.supplierRepository.findAll();
  }

  /**
   * Get one Supplier
   */
  async getOneSupplier(id: number): Promise<Supplier> {
    try {
      return await this.supplierRepository.findOneOrFail({ id });
    } catch (e) {
      this.logger.error(`${e.message} `, e);
      return e;
    }
  }
}
