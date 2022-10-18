import {
  MaxLength,
  IsNumberString,
  IsOptional,
  IsNotEmpty,
  IsDefined,
} from 'class-validator';

import { Product } from '../../entities';

export class StockIdParamDto {
  @IsNumberString()
  @IsDefined()
  public id: number;
}

export class StockDto {
  @IsNumberString()
  @IsOptional()
  public id: number;

  @IsNotEmpty()
  @MaxLength(64)
  public quantity: number;

  @IsOptional()
  public createdAt: Date;

  @IsOptional()
  public updatedAt: Date;

  @IsOptional()
  public product: Product;
}
