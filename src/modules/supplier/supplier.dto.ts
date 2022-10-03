/* eslint-disable prettier/prettier */
import {
    MinLength,
    MaxLength,
    IsNumberString,
    IsNumber,
    IsOptional,
    IsNotEmpty,
    IsDefined,
  } from 'class-validator';
  
  export class ParamDto {
    @MinLength(14)
    @MaxLength(14)
    @IsNumberString()
    @IsNotEmpty()
    public siret: string;
  }

  export class SupplierIdParamDto {
    @IsNumberString()
    @IsDefined()
    public id: number;
  }
  export class UpdateSupplierDto {
    @IsNumber()
    // @IsOptional()
    public id: number;
  
    @IsOptional()
    @MaxLength(64)
    public name: string;

    @IsOptional()
    @MaxLength(10)
    @MinLength(10)
    @IsNumberString()
    public phoneNumber: string;
  
    @IsOptional()
    @MaxLength(150)
    public address: string;

    @IsOptional()
    @MaxLength(5)
    @MinLength(5)
    @IsNumberString()
    public postcode: string;

    @IsOptional()
    @MaxLength(64)
    public city: string;

    @MinLength(9)
    @MaxLength(9)
    @IsNumberString()
    @IsOptional()
    public siren: string;

    @MinLength(14)
    @MaxLength(14)
    @IsNumberString()
    @IsOptional()
    public siret: string;

    @MaxLength(64)
    @IsOptional()
    public contact: string;
  
    @IsOptional()
    public pictureUrl: string;
  
    @IsOptional()
    public isActive = true;
  
    @IsOptional()
    public createdAt: Date = new Date();
  
    @IsOptional()
    public updatedAt: Date = new Date();
  }
  export class SupplierDto {
    @IsNumber()
    @IsOptional()
    public id: number;
  
    @IsNotEmpty()
    @MaxLength(64)
    public name: string;

    @IsNotEmpty()
    @MaxLength(10)
    @MinLength(10)
    @IsNumberString()
    public phoneNumber: string;
  
    @IsNotEmpty()
    @MaxLength(150)
    public address: string;

    @IsNotEmpty()
    @MaxLength(5)
    @MinLength(5)
    @IsNumberString()
    public postcode: string;

    @IsNotEmpty()
    @MaxLength(64)
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

    @MaxLength(64)
    @IsOptional()
    public contact: string;
  
    @IsOptional()
    public pictureUrl: string;
  
    @IsOptional()
    public isActive = true;
  
    @IsOptional()
    public createdAt: Date = new Date();
  
    @IsOptional()
    public updatedAt: Date = new Date();
  }