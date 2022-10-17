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

// export class UpdateStockDto {
//   @IsNumberString()
//   @IsOptional()
//   public id: number;

//   @IsOptional()
//   @MaxLength(64)
//   public name: string;

//   @IsOptional()
//   public createdAt: Date = new Date();

//   @IsOptional()
//   public updatedAt: Date = new Date();

//   @IsOptional()
//   public aisle: Aisle;
// }

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
