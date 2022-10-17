import {
  MaxLength,
  IsNumberString,
  IsOptional,
  IsNotEmpty,
  IsDefined,
} from 'class-validator';

import { Aisle } from '../../entities';

export class CategoryIdParamDto {
  @IsNumberString()
  @IsDefined()
  public id: number;
}

export class UpdateCategoryDto {
  @IsNumberString()
  @IsOptional()
  public id: number;

  @IsOptional()
  @MaxLength(64)
  public name: string;

  @IsOptional()
  public createdAt: Date = new Date();

  @IsOptional()
  public updatedAt: Date = new Date();

  @IsOptional()
  public aisle: Aisle;
}

export class CategoryDto {
  @IsNumberString()
  @IsOptional()
  public id: number;

  @IsNotEmpty()
  @MaxLength(64)
  public name: string;

  @IsOptional()
  public createdAt: Date = new Date();

  @IsOptional()
  public updatedAt: Date = new Date();

  @IsOptional()
  public aisle: Aisle;
}
