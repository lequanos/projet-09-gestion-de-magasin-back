/* eslint-disable @typescript-eslint/no-unused-vars */
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs/mikro-orm.common';
import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { Supplier } from '../../entities';
import { CreateSupplierDTO } from './create-supplier-dto';

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

  /**
   * Create Supplier
   */
  async createSupplier(dto: CreateSupplierDTO): Promise<Supplier> {
    const {
      name,
      phoneNumber,
      address,
      postcode,
      city,
      siren,
      siret,
      contact,
      pictureUrl,
    } = dto;
    const supplier = new Supplier();

    await this.supplierRepository.persistAndFlush(supplier);
    return supplier;
  }
}
