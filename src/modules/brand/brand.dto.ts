import {
  MaxLength,
  IsNumberString,
  IsOptional,
  IsNotEmpty,
  IsDefined,
} from 'class-validator';

export class BrandIdParamDto {
  @IsNumberString()
  @IsDefined()
  public id: number;
}

export class UpdateBrandDto {
  @IsNumberString()
  public id: number;

  @IsOptional()
  @MaxLength(64)
  public name: string;

  @IsOptional()
  public createdAt: Date;

  @IsOptional()
  public updatedAt: Date;
}

export class BrandDto {
  @IsNumberString()
  @IsOptional()
  public id: number;

  @IsNotEmpty()
  @MaxLength(64)
  public name: string;

  @IsOptional()
  public createdAt: Date;

  @IsOptional()
  public updatedAt: Date;
}
