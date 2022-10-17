import {
  MaxLength,
  IsNumberString,
  IsOptional,
  IsNotEmpty,
  IsDefined,
  IsEmail,
} from 'class-validator';

import { Collection } from '@mikro-orm/core';

import { Aisle, Store, Role } from '../../entities';

export class UserIdParamDto {
  @IsNumberString()
  @IsDefined()
  public id: number;
}

export class CreateUserDto {
  @IsNumberString()
  @IsOptional()
  public id: number;

  @IsNotEmpty()
  @MaxLength(64)
  public firstname: string;

  @IsNotEmpty()
  @MaxLength(64)
  public lastname: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  public email: string;

  @IsNotEmpty()
  @MaxLength(64)
  public password: string;

  @IsOptional()
  public refreshToken: string;

  @IsOptional()
  public pictureUrl: string;

  @IsOptional()
  public isActive = true;

  @IsOptional()
  public createdAt: Date;

  @IsOptional()
  public updatedAt: Date;

  @IsOptional()
  public role: Role;

  @IsOptional()
  public store: Store;

  @IsOptional()
  public aisles: Aisle[];
}

export class UpdateUserDto {
  @IsNumberString()
  public id: number;

  @IsOptional()
  @MaxLength(64)
  public firstname: string;

  @IsOptional()
  @MaxLength(64)
  public lastname: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  public email: string;

  @IsOptional()
  @MaxLength(64)
  public password: string;

  @IsOptional()
  public refreshToken: string;

  @IsOptional()
  public pictureUrl: string;

  @IsOptional()
  public isActive: boolean;

  @IsOptional()
  public createdAt: Date;

  @IsOptional()
  public updatedAt: Date;

  @IsOptional()
  public role: Role;

  @IsOptional()
  public store: Store;

  @IsOptional()
  public aisles: Collection<Aisle, object>;
}
