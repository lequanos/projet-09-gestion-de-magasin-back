import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpCode,
} from '@nestjs/common';

import { Aisle } from '../../entities';
import { AisleService } from './aisle.service';
import { AisleIdParamDto, AisleDto, UpdateAisleDto } from './aisle.dto';

/**
 * Controller for the aisles
 */
@Controller('aisle')
export class AisleController {
  constructor(private readonly aisleService: AisleService) {}

  /**
   * Get all aisles
   */
  @Get()
  async getAllAisles(): Promise<Aisle[]> {
    return await this.aisleService.getAll();
  }

  /**
   * Get one aisle by id
   */
  @Get(':id')
  async getOneAisleById(@Param('id') id: number): Promise<Aisle> {
    return await this.aisleService.getOneById(id);
  }

  /**
   * Create one aisle
   * @param aisleDto the user's input
   * @returns the created aisle
   */
  @Post()
  async createAisle(@Body() aisleDto: AisleDto): Promise<Aisle> {
    return await this.aisleService.createAisle(aisleDto);
  }

  /**
   * Update one aisle
   * @param aisleDto the user's input
   * @returns the updated aisle
   */
  @Put()
  async updateAisle(@Body() aisleDto: UpdateAisleDto): Promise<Aisle> {
    return await this.aisleService.updateAisle(aisleDto);
  }

  /**
   * Delete one aisle
   */
  @HttpCode(204)
  @Delete('/delete/:id')
  async deleteAisle(@Param() param: AisleIdParamDto): Promise<void> {
    await this.aisleService.deleteAisle(param.id);
  }
}
