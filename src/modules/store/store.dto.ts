import {
  MinLength,
  MaxLength,
  IsNumberString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsDefined,
} from 'class-validator';

export class SiretParamDto {
  @MinLength(14)
  @MaxLength(14)
  @IsNumberString()
  @IsNotEmpty()
  public siret: string;
}

export class StoreIdParamDto {
  @IsNumberString()
  @IsDefined()
  public id: number;
}

export class StoreDto {
  @IsNumberString()
  @IsOptional()
  public id: number;

  @IsNotEmpty()
  @MaxLength(64)
  public name: string;

  @IsNotEmpty()
  @MaxLength(150)
  public address: string;

  @MinLength(5)
  @MaxLength(5)
  @IsNumberString()
  @IsNotEmpty()
  public postcode: string;

  @MaxLength(64)
  @IsNotEmpty()
  public city: string;

  @MinLength(9)
  @MaxLength(9)
  @IsNumberString()
  @IsNotEmpty()
  public siren: string;

  @MinLength(14)
  @MaxLength(14)
  @IsNumberString()
  @IsOptional()
  public siret: string;

  @IsOptional()
  public pictureUrl: string;

  @IsOptional()
  public isActive = true;

  @IsOptional()
  public createdAt: Date = new Date();

  @IsOptional()
  public updatedAt: Date = new Date();
}
