/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs/mikro-orm.common';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { isNotFoundError } from 'src/typeguards/ExceptionTypeGuards';
import { Supplier } from '../../entities';
import { SupplierDto } from './supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: EntityRepository<Supplier>,
    private readonly logger: Logger = new Logger('SupplierService'),
  ) {}

  /**
   * Get all Suppliers who are active
   */
  async getAll(): Promise<Supplier[]> {
    try {
      return await this.supplierRepository.findAll({
        filters: { where: { isActive: true } },
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
   * Get one Supplier by ID
   * @param id the searched id number
   * @returns the supplier
   */
  async getOneSupplier(id: number): Promise<Supplier> {
    try {
      return await this.supplierRepository.findOneOrFail({ id });
    } catch (e) {
      this.logger.error(`${e.message} `, e);

      if (isNotFoundError(e)) {
        throw new NotFoundException();
      }

      throw e;
    }
  }

  // /**
  //  * Get one Supplier by Siret
  //  * @param siren the searched siret number
  //  * @returns the supplier
  //  */
  // async getOneBySiren(siren: string): Promise<Supplier> {
  //   try {
  //     return await this.supplierRepository.findOneOrFail({
  //       siren,
  //       isActive: true,
  //     });
  //   } catch (e) {
  //     this.logger.error(`${e.message} `, e);

  //     if (isNotFoundError(e)) {
  //       throw new NotFoundException();
  //     }

  //     throw e;
  //   }
  // }

  /**
   * Create Supplier
   * @params supplierDto
   * @returns supplier created
   */
  async createSupplier(supplierDto: SupplierDto): Promise<Supplier> {
    try {
      const foundSupplierSiren = await this.supplierRepository.findOneOrFail({
        siren: supplierDto.siren,
      });

      if (foundSupplierSiren)
        throw new ConflictException(
          `Supplier already exists${
            foundSupplierSiren.isActive ? '' : ' but is deactivated'
          }`,
        );

      const supplier = this.supplierRepository.create(supplierDto);
      await this.supplierRepository.persistAndFlush(supplier);
      return supplier;
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
  async updateSupplier(supplierDto: SupplierDto): Promise<Supplier> {
    try {
      const foundSupplier = await this.supplierRepository.findOneOrFail(
        supplierDto.id,
      );

      if (!foundSupplier?.isActive)
        throw new ConflictException('Supplier is deactivated');

      foundSupplier.name = supplierDto.name;
      foundSupplier.phoneNumber = supplierDto.phoneNumber;
      foundSupplier.address = supplierDto.address;
      foundSupplier.postcode = supplierDto.postcode;
      foundSupplier.city = supplierDto.city;
      foundSupplier.siren = supplierDto.siren;
      foundSupplier.siret = supplierDto.siret;
      foundSupplier.contact = supplierDto.contact;
      foundSupplier.isActive = supplierDto.isActive;
      foundSupplier.pictureUrl = supplierDto.pictureUrl;

      await this.supplierRepository.persistAndFlush(foundSupplier);
      return foundSupplier;
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
  async deactivateSupplier(id: number): Promise<Supplier> {
    try {
      const supplier = await this.supplierRepository.findOneOrFail({ id });

      if (!supplier.isActive)
        throw new ConflictException('Supplier is already deactivated');

      supplier.isActive = false;
      await this.supplierRepository.persistAndFlush(supplier);
      return supplier;
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
  async reactivateSupplier(id: number): Promise<Supplier> {
    try {
      const supplier = await this.supplierRepository.findOneOrFail({ id });

      if (supplier?.isActive)
        throw new ConflictException('Supplier is already activated');

      supplier.isActive = true;
      await this.supplierRepository.persistAndFlush(supplier);
      return supplier;
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
  async deleteStore(supplierId: number): Promise<void> {
    try {
      const foundSupplier = await this.supplierRepository.findOneOrFail(
        supplierId,
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
}
