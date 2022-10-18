import {
  MaxLength,
  IsNumberString,
  IsOptional,
  IsNotEmpty,
  IsDefined,
} from 'class-validator';

import { Store } from '../../entities';

export class AisleIdParamDto {
  @IsNumberString()
  @IsDefined()
  public id: number;
}

export class UpdateAisleDto {
  @IsNumberString()
  public id: number;

  @IsOptional()
  @MaxLength(64)
  public name: string;

  @IsOptional()
  public createdAt: Date = new Date();

  @IsOptional()
  public updatedAt: Date = new Date();

  @IsOptional()
  public store: Store;
}

export class AisleDto {
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

  @IsDefined()
  public store: Store;
}
