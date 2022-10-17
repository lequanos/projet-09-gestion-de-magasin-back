import {
  MaxLength,
  IsNumberString,
  IsOptional,
  IsNotEmpty,
  IsDefined,
  Min,
  IsEnum,
  IsInt,
} from 'class-validator';

import {
  Store,
  ProductNutriscore,
  ProductEcoscore,
  Supplier,
  Category,
} from '../../entities';

export class ProductIdParamDto {
  @IsNumberString()
  @IsDefined()
  public id: number;
}

export class CreateProductDto {
  @IsNumberString()
  @IsOptional()
  public id: number;

  @IsNotEmpty()
  @MaxLength(64)
  public name: string;

  @IsNotEmpty()
  @MaxLength(13)
  public code: string;

  @Min(0)
  public price: number;

  @IsOptional()
  public pictureUrl: string;

  @IsEnum(ProductNutriscore)
  public nutriScore: ProductNutriscore;

  @IsEnum(ProductEcoscore)
  public ecoScore: ProductEcoscore;

  @IsOptional()
  public unitPackaging: string;

  @IsInt()
  @Min(0)
  public threshold: number;

  @IsOptional()
  public ingredients: string;

  @IsOptional()
  public createdAt: Date;

  @IsOptional()
  public updatedAt: Date;

  @IsDefined()
  public brand: string;

  @IsOptional()
  public store: Store;

  @IsOptional()
  public isActive = true;

  @IsDefined()
  public suppliers: Supplier[];

  @IsDefined()
  public categories: Category[];

  @IsOptional()
  public inStock = 0;
}

export class UpdateProductDto {
  @IsNumberString()
  public id: number;

  @IsOptional()
  @MaxLength(64)
  public name: string;

  @IsOptional()
  @MaxLength(13)
  public code: string;

  @Min(0)
  @IsOptional()
  public price: number;

  @IsOptional()
  public pictureUrl: string;

  @IsOptional()
  @IsEnum(ProductNutriscore)
  public nutriScore: ProductNutriscore;

  @IsOptional()
  @IsEnum(ProductEcoscore)
  public ecoScore: ProductEcoscore;

  @IsOptional()
  public unitPackaging: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  public threshold: number;

  @IsOptional()
  public ingredients: string;

  @IsOptional()
  public createdAt: Date;

  @IsOptional()
  public updatedAt: Date;

  @IsDefined()
  public brand: string;

  @IsOptional()
  public store: Store;

  @IsOptional()
  public isActive: boolean;

  @IsOptional()
  public suppliers: Supplier[];

  @IsOptional()
  public categories: Category[];

  @IsOptional()
  public inStock = 0;
}

export class GetParams {
  @IsOptional()
  fields: string;
}
